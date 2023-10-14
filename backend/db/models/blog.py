from pydantic import BaseModel
from typing import Union

class Blog(BaseModel):
    id: int = None
    title: str
    content: str
    user_id: int
    banner_img: Union[bytes, None]