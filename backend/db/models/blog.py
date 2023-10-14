from pydantic import BaseModel
from typing import Optional

class Blog(BaseModel):
    id: int = None
    title: str
    content: str
    user_id: int
    banner_img: Optional[bytes] = ""