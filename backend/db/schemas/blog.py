import base64
import re

def blog_schema(blog) -> dict:
    if blog["blogs_banner_img"]:
        # print("image from schema before encode:", blog["blogs_banner_img"][:30])
        blog["blogs_banner_img"] = base64.b64encode(blog["blogs_banner_img"])

        # if b"dataimage/png" in blog["blogs_banner_img"]:
        #     blog["blogs_banner_img"] = re.sub(
        #         b"dataimage/pngbase64",
        #         b"",
        #         blog["blogs_banner_img"]
        #     )
        #     # blog["blogs_banner_img"] = re.sub(
        #     #     b"=",
        #     #     b"",
        #     #     blog["blogs_banner_img"]
        #     # )
        #     print("image from schema after encode:", blog["blogs_banner_img"][-30:])
    
    return {
        "id": blog["blogs_id"],
        "title": blog["blogs_title"],
        "content": blog["blogs_content"],
        "user_id": blog["blogs_users_id"],
        "banner_img": blog["blogs_banner_img"]
    }


def blogs_schema(blogs) -> list:
    return [blog_schema(blog) for blog in blogs]