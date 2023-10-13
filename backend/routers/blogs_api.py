from fastapi import APIRouter, HTTPException, status

from db.models.blog import Blog
from db.schemas.blog import blog_schema, blogs_schema
from db.blogs_database import create_blog, find_blog, find_users_blogs, update_blog, delete_blog

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


# Get one user's blogs -> GET
@router.get("/{user_id}", response_model=list[Blog], status_code=status.HTTP_200_OK)
async def my_blogs(user_id: int):
    blogs = find_users_blogs(user_id)

    if not blogs:
        return []

    return blogs_schema(blogs)


# Get one single blog by its ID -> GET
@router.get("/single-blog/{blog_id}", response_model=Blog, status_code=status.HTTP_200_OK)
async def single_blog(blog_id: int):
    blog = find_blog(blog_id)

    if not blog:
        return

    return Blog(**blog_schema(blog))


# Update one blog's data / content -> PUT
@router.put("/edit-blog", status_code=status.HTTP_201_CREATED)
async def edit_blog(blog: Blog):
    update_blog(blog, blog.id)


# Delete blog -> DELETE
@router.delete("/remove-blog/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_blog(blog_id: int):
    delete_blog(blog_id)