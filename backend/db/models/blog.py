from pydantic import BaseModel

class Blog(BaseModel):
    id: int = None
    title: str
    content: str
    user_id: int
    banner_img: str = ""