from pydantic import BaseModel


class User(BaseModel):
    id: int = None
    username: str
    email: str
    image: str = ""


class UserDB(User):
    password: str