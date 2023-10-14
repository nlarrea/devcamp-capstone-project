import os
from fastapi import APIRouter, HTTPException, status, Request
from jose import jwt, JWTError
import base64

from db.models.blog import Blog
from db.schemas.blog import blog_schema, blogs_schema
from db.blogs_database import create_blog, find_blog, find_users_blogs, update_blog, delete_blog

ALGORITHM = "HS256"
SECRET = os.environ.get("SECRET")


router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)


# AUXILIARY FUNCTIONS

def search_blog_by_user(blog_to_find: Blog) -> Blog:
    """ Searches a single blog based on a user ID from the blog to search in
     the database.
    
     Parameters:
        - blog_to_find (`Blog`): the blog to find and get its ID.

     Returns:
        - (`Blog`): The blog with all the parameters saved in the database.
    """

    blog = find_users_blogs(blog_to_find.user_id)[0]

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The Blog you're searching for is not in Database."
        )

    return Blog(**blog_schema(blog))


def search_blog_by_id(blog_id: int) -> Blog:
    """ Searches a single blog by its ID.
     
     Parameters:
        - blog_id (`int`): The ID of the blog to be found.
    
     Returns:
        - (`Blog`): The blog with all the parameters saved in the database.
    """

    blog = find_blog(blog_id)

    return Blog(**blog_schema(blog))


def validate_token(request: Request):
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
    

# BLOGS DEFINITIONS

@router.post("/new-blog", status_code=status.HTTP_201_CREATED)
async def new_blog(blog: Blog, request: Request):
    # Check if access token is valid
    validate_token(request)

    blog_dict = dict(blog)
    del blog_dict["id"]

    # If blog has image -> decode it
    if blog_dict["banner_img"]:
        blog_encoded_image = blog_dict["banner_img"]
        blog_image = base64.b64decode(blog_encoded_image)
        blog_dict["banner_img"] = blog_image

    # Insert the blog into the database
    create_blog(blog_dict)

    # Return the inserted blog
    return search_blog_by_user(blog)


# Get one user's blogs -> GET
@router.get("/{user_id}", response_model=list[Blog] | list, status_code=status.HTTP_200_OK)
async def my_blogs(user_id: int):
    if not type(user_id) == int:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The blog ID must be an integer!"
        )
    
    blogs = find_users_blogs(user_id)

    if not blogs:
        return []

    return blogs_schema(blogs)


# Get one single blog by its ID -> GET
@router.get("/single-blog/{blog_id}", response_model=Blog | None, status_code=status.HTTP_200_OK)
async def single_blog(blog_id: int):
    if not type(blog_id) == int:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The blog ID must be an integer!"
        )

    blog = find_blog(blog_id)

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No blog with ID = {blog_id} has been found!"
        )

    return Blog(**blog_schema(blog))


# Update one blog's data / content -> PUT
@router.put("/edit-blog", response_model=Blog, status_code=status.HTTP_201_CREATED)
async def edit_blog(blog: Blog, request: Request):
    validate_token(request)

    blog_dict = dict(blog)

    # If blog has image -> decode it
    if blog_dict["banner_img"]:
        blog_encoded_image = blog_dict["banner_img"]
        blog_image = base64.b64decode(blog_encoded_image)
        blog_dict["banner_img"] = blog_image

    update_blog(blog_dict, blog.id)

    return search_blog_by_id(blog.id)


# Delete blog -> DELETE
@router.delete("/remove-blog/{blog_id}", response_model=int, status_code=status.HTTP_200_OK)
async def remove_blog(blog_id: int, request: Request):
    validate_token(request)
    delete_blog(blog_id)

    return blog_id