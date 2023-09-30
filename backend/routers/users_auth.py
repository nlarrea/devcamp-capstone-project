import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta

from database import get_users, create_user


ALGORITHM = "HS256"
ACCESS_TOKEN_DURATION = 1   # 1 hour
SECRET = os.environ.get("SECRET")


router = APIRouter()
oauth2 = OAuth2PasswordBearer(tokenUrl="login")
crypt = CryptContext(schemes=["bcrypt"])


# USERS DEFINITION

class User(BaseModel):
    username: str
    email: str

class UserDB(User):
    password: str


# es para que no de error, pero debo hacer algo para conectar a la db
users_db = []


# FUNCTIONS

def search_user_db(username: str):
    if username in users_db:
        return UserDB(**users_db[username])
    
def search_user(username: str):
    if username in users_db:
        return User(**users_db[username])
    

async def auth_user(token: str = Depends(oauth2)):
    exception = HTTPException(
        status_code=401,
        detail="Not valid credentials.",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        # Get username from token
        username = jwt.decode(
            token,
            SECRET,
            algorithms=[ALGORITHM]
        ).get("sub")

        # Check the given username
        if username is None:
            raise exception
    except JWTError:
        raise exception
    
    # If no errors, return the current user's data
    return search_user(username)


@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    # obtener usuario

    if not users_db[user.username]:
        raise HTTPException(
            status_code=400,
            detail="The user is not correct."
        )

    user = search_user_db(form.username)

    if not crypt.verify(form.password, user.password):
        raise HTTPException(
            status_code=400,
            detail="The password is not correct."
        )
    
    access_token = {
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_DURATION)
    }
    
    return {
        "access_token": jwt.encode(
            access_token,
            SECRET,
            algorithm=ALGORITHM
        ),
        "token_type": "bearer"
    }


@router.get("/users/me")
async def me(user: User = Depends(auth_user)):
    return user


# Register

@router.post("/register")
async def register(form: OAuth2PasswordRequestForm = Depends()):
    # Check if the user already exists
    if search_user_db(form.username):
        raise HTTPException(
            status_code=400,
            detail="The user already exists."
        )
    
    # Hash the password
    hashed_password = crypt.hash(form.password)

    # Insert the user into the database
    users_db[form.username] = {
        "username": form.username,
        "password": hashed_password,
        "email": form.email
    }

    # Return the new user's data
    return search_user(form.username)


# Users data

@router.get("/users")
async def read_users():
    # Get all the users from the database
    users = get_users()

    # Return the users
    return users or "Not users found"


# Define the endpoint to create a new user
@router.post("/users", status_code=201)
async def create_user_endpoint(user: UserDB):
    hashed_password = crypt.hash(user.password)
    print(f"User: {user.username}, {user.email}, {hashed_password}")
    # create_user(user.username, user.email, hashed_password)

    # Return the user
    return User(username=user.username, email=user.email)