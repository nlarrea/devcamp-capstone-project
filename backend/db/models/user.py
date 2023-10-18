from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    id: int = None
    username: str
    email: str
    image: Optional[bytes] = ""


class UserDB(User):
    password: str