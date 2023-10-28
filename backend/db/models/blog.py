from pydantic import BaseModel
from typing import Optional

class Blog(BaseModel):
    id: str = None
    title: str
    content: str
    user_id: str
    banner_img: Optional[bytes] = ""