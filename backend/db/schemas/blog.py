import base64

def blog_schema(blog) -> dict:
    if blog["blogs_banner_img"]:
        blog["blogs_banner_img"] = base64.b64encode(blog["blogs_banner_img"])

    return {
        "id": blog["blogs_id"],
        "title": blog["blogs_title"],
        "content": blog["blogs_content"],
        "user_id": blog["blogs_users_id"],
        "banner_img": blog["blogs_banner_img"]
    }


def blogs_schema(blogs) -> list:
    return [blog_schema(blog) for blog in blogs]