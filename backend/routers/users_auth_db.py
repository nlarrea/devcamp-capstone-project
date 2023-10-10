import os
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta

from db.models.user import User, UserDB
from db.database import get_users, create_user, find_user


ALGORITHM = "HS256"
ACCESS_TOKEN_DURATION = 1   # 1 hour
SECRET = os.environ.get("SECRET")


router = APIRouter()
oauth2_register = OAuth2PasswordBearer(tokenUrl="register")
oauth2_login = OAuth2PasswordBearer(tokenUrl="login")
crypt = CryptContext(schemes=["bcrypt"])


# USERS DEFINITION

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def user(form: OAuth2PasswordRequestForm = Depends()):
    if type(find_user(form.username)) == User:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user already exists!"
        )

    # Hash the password
    hashed_password = crypt.hash(form.password)

    # Insert the user into the database
    create_user(
        form.username,
        form.email,
        hashed_password
    )

    # Create new user based on the schema
    # new_user = # busca el usuario en la db, crea un objeto User con él y devuélvelo

    # Return the new user's data
    return User(**new_user)