import base64

def blog_schema(blog) -> dict:
    if blog["banner_img"]:
        blog["banner_img"] = base64.b64encode(blog["banner_img"])

    return {
        "id": str(blog["_id"]),
        "title": blog["title"],
        "content": blog["content"],
        "user_id": blog["user_id"],
        "banner_img": blog["banner_img"]
    }


def blogs_schema(blogs) -> list:
    return [blog_schema(blog) for blog in blogs]