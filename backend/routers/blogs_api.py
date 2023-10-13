from fastapi import APIRouter, HTTPException, status

from db.models.blog import Blog
from db.blogs_database import create_blog

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)


# AUXILIARY FUNCTIONS


# BLOGS DEFINITIONS

@router.post("/new-blog", status_code=status.HTTP_201_CREATED)
async def new_blog(blog: Blog):
    blog_dict = dict(blog)
    del blog_dict["id"]

    # Insert the blog into the database
    create_blog(blog_dict)