import os
from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from db.models.blog import Blog
from db.models.user import User
from db.schemas.blog import blog_schema, blogs_schema
from db.blogs_database import create_blog, find_blog, find_users_blogs, update_blog, delete_blog

ALGORITHM = "HS256"
ACCESS_TOKEN_DURATION = 3   # 3 hours
SECRET = os.environ.get("SECRET")


router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)


# AUXILIARY FUNCTIONS

def validate_token(request: Request):
    not_authorized_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="You do not have the necessary permissions"
    )

    # Check if request has the "Authorization" header
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise not_authorized_exception
    
    # Check if the Token is valid
    try:
        access_token = auth_header.split(" ")[1]
        username: str = jwt.decode(access_token, SECRET, algorithms=[ALGORITHM]).get("sub")

    except JWTError:
        raise not_authorized_exception
    
    else:
        return username
    

# BLOGS DEFINITIONS

@router.post("/new-blog", status_code=status.HTTP_201_CREATED)
async def new_blog(blog: Blog, request: Request):
    validate_token(request)

    blog_dict = dict(blog)
    del blog_dict["id"]

    # Insert the blog into the database
    create_blog(blog_dict)


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
@router.put("/edit-blog", status_code=status.HTTP_201_CREATED)
async def edit_blog(blog: Blog, request: Request):
    validate_token(request)
    update_blog(blog, blog.id)


# Delete blog -> DELETE
@router.delete("/remove-blog/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_blog(blog_id: int, request: Request):
    validate_token(request)
    delete_blog(blog_id)