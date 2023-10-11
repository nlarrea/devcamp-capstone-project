import os
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta

from db.models.user import User, UserDB
from db.schemas.user import user_schema, users_schema
from db.database import get_all_users, create_user, find_user


ALGORITHM = "HS256"
ACCESS_TOKEN_DURATION = 1   # 1 hour
SECRET = os.environ.get("SECRET")


router = APIRouter()
oauth2_register = OAuth2PasswordBearer(tokenUrl="register")
oauth2_login = OAuth2PasswordBearer(tokenUrl="login")
crypt = CryptContext(schemes=["bcrypt"])


# USERS DEFINITION

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def user(user: UserDB):
    if type(search_user("username", user.username)) == User or type(search_user("email", user.email)) == User:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user already exists!"
        )

    # Hash the password
    hashed_password = crypt.hash(user.password)

    # Create a user dictionary with the hashed password
    user_dict = dict(user)
    user_dict["password"] = hashed_password
    del user_dict["id"]     # no necesario porque no lo uso en create_user

    # Insert the user into the database
    create_user(user_dict)

    # Create new user based on the schema to generate a User object
    new_user = search_user("username", user.username)

    # Return the new user's data
    return new_user


def search_user(field: str, key):
    try:
        user = find_user(field, key)
        return User(**user_schema(user))
    
    except:
        return {"error": "User is not found!"}