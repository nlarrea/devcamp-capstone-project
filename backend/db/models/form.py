from pydantic import BaseModel
from typing import Optional

class LoginForm(BaseModel):
    email: str
    password: str


class EditForm(BaseModel):
    username: Optional[str] = ""
    email: Optional[str] = ""
    old_password: str
    new_password: Optional[str] = ""
    image: Optional[bytes] = ""