import os
from fastapi import APIRouter, HTTPException, status, Request
from jose import jwt, JWTError
from bson import ObjectId, Binary
import base64
import re

from db.client import db_client
from db.models.blog import Blog
from db.schemas.blog import blog_schema, blogs_schema

ALGORITHM = "HS256"
SECRET = os.environ.get("SECRET")


router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)


# AUXILIARY FUNCTIONS


def search_blog_by_id(blog_id: str) -> Blog:
    """ Searches a single blog by its ID.
     
     Parameters:
        - blog_id (`int`): The ID of the blog to be found.
    
     Returns:
        - (`Blog`): The blog with all the parameters saved in the database.
    """

    blog = db_client.blogs.find_one({"_id": ObjectId(blog_id)})

    return Blog(**blog_schema(blog))


def validate_token(request: Request) -> str:
    """ Checks if the request has a header called "Authorization" with the
     access token. If so, checks if the token did not expire.
    
     Parameters:
        - request (`fastapi.Request`): The request made from frontend side.
    
     Returns:
        - username (`str`): The username read from the access token.
    """

    # Check if request has the "Authorization" header
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "type": "Authorization",
                "message": "You do not have the necessary permissions"
            }
        )
    
    # Check if the Token is valid
    try:
        access_token = auth_header.split(" ")[1]
        username: str = jwt.decode(access_token, SECRET, algorithms=[ALGORITHM]).get("sub")

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "type": "expired",
                "message": "You do not have the necessary permissions"
            }
        )
    
    else:
        return username
    

def process_base64_images(base64_image) -> bytes:
    def decode_base64(data, alt_chars=b"+/"):
        """ Decode base64, padding being optional.

        Parameters:
            - data: base64 data as an ASCII byte string.
        
        Returns:
            - The decoded byte sting.
        """

        # Normalize
        data = re.sub(rb"[^a-zA-Z0-9%s]+" % alt_chars, b"", data)

        missing_padding = len(data) % 4
        if missing_padding:
            data += b"=" * (4 - missing_padding)

        return base64.b64decode(data, alt_chars)
    

    if b"png" in base64_image:
            base64_image = re.sub(b"png", b"jpeg", base64_image)
            
    blog_encoded_image = base64_image
    blog_image = decode_base64(blog_encoded_image)
    return blog_image


# BLOGS DEFINITIONS


@router.post("/new-blog", status_code=status.HTTP_201_CREATED)
async def new_blog(blog: Blog, request: Request):
    """ Posts a new blog in the database.
    
     Parameters:
        - blog (`Blog`): The new blog to be posted in the database.
        - request (`Request`): The HTTP request.

     Returns:
        - (`blog`): The latest blog of the logged user.
    """

    # Check if access token is valid
    validate_token(request)

    # INSERT BLOG INTO DATABASE
    blog_dict = dict(blog)
    del blog_dict["id"]

    # If blog has image -> decode it
    if blog_dict["banner_img"]:
        blog_dict["banner_img"] = process_base64_images(blog_dict["banner_img"])

    id = db_client.blogs.insert_one(blog_dict).inserted_id

    new_blog = blog_schema(
        db_client.blogs.find_one({"_id": id})
    )

    return Blog(**new_blog)


@router.get("/user/{user_id}", response_model=dict | list, status_code=status.HTTP_200_OK)
async def my_blogs(user_id: str, page: int):
    """ Gets the blogs from a user. It uses a limit so it doesn't return all
     the existing blogs at once.
     
     Parameters:
        - user_id (`int`): The current user's ID.
        - page (`int`): A counter to know which blogs should be requested.
    
     Returns:
        - (`dict`): A dictionary containing a list of blogs and the amount of
        those blogs that are returned.
    """

    limit = 10
    offset = (page * limit) - limit
    blogs = list(
        db_client.blogs.find({"user_id": user_id})
        .skip(offset)
        .limit(limit)
    )
    
    if not blogs:
        return {
            "blogs": [],
            "total": 0
        }
    
    return {
        "blogs": blogs_schema(blogs)[::-1],
        "total": len(list(db_client.blogs.find({"user_id": user_id})))
    }


@router.get("/all-blogs", response_model=dict, status_code=status.HTTP_200_OK)
async def get_all_blogs(page: int = 1):
    """ Gets all the blogs from database. It uses a limit and an offset to
     avoid returning all the blogs at once.
    
     Parameters:
        - page (`int`): The current page to calculate the range of blogs that
        are going to be requested to the database.

     Returns:
        - (`dict`): A dictionary containing a list of blogs and the amount of
        blogs.
    """

    limit = 10
    offset = (page * limit) - limit
    blogs_list = list(
        db_client.blogs.find()
        .skip(offset)
        .limit(limit)
    )
    
    if not blogs_list:
        return {
            "blogs": [],
            "total": 0
        }
    
    return {
        "blogs": blogs_schema(blogs_list)[::-1],
        "total": len(list(db_client.blogs.find()))
    }


@router.get("/single-blog/{blog_id}", response_model=Blog | None, status_code=status.HTTP_200_OK)
async def single_blog(blog_id: str):
    """ Finds a single blog by its ID.

     Parameters:
        - blog_id (`int`): The ID of the blog to be find.

     Returns:
        - (`Blog`): The blog that matched the received blog ID.
    """

    blog = db_client.blogs.find_one({"_id": ObjectId(blog_id)})

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No blog with ID = {blog_id} has been found!"
        )
    
    return Blog(**blog_schema(blog))


@router.put("/edit-blog", status_code=status.HTTP_201_CREATED)
async def edit_blog(blog: Blog, request: Request):
    """ Updates an already existing blog.
    
     Parameters:
        - blog (`Blog`): The blog to be updated.
        - request (`Request`): The HTTP request.

     Returns:
        - (`Blog`): The updated blog with the new data on it.
    """

    validate_token(request)

    blog_dict = dict(blog)

    # If blog has image -> decode it
    if blog_dict["banner_img"]:
        blog_dict["banner_img"] = process_base64_images(blog_dict["banner_img"])

    try:
        db_client.blogs.find_one_and_replace({"_id": ObjectId(blog.id)}, blog_dict)
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog couldn't be found!"
        )
    
    updated_blog = blog_schema(
        db_client.blogs.find_one({"_id": ObjectId(blog.id)})
    )

    return Blog(**updated_blog)


@router.delete("/remove-blog/{blog_id}", response_model=str, status_code=status.HTTP_200_OK)
async def remove_blog(blog_id: str, request: Request):
    """ Deletes a blog.
    
     Parameters:
        - blog_id (`int`): The ID of the blog that is going to be removed.
        - request (`Request`): The HTTP request.
    
     Returns:
        - (`int`): The removed blog's ID.
    """

    validate_token(request)
    found = db_client.blogs.find_one_and_delete({"_id": ObjectId(blog_id)})

    if not found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog Not Deleted"
        )
    
    return str(found["_id"])