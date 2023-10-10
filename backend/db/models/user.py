from pydantic import BaseModel


class User(BaseModel):
    id: int
    username: str
    email: str


class UserDB(User):
    password: str