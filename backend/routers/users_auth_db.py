import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta

from db.models.user import User, UserDB
from db.models.form import LoginForm
from db.schemas.user import user_schema, users_schema
from db.database import get_all_users, create_user, find_user


ALGORITHM = "HS256"
ACCESS_TOKEN_DURATION = 3   # 3 hours
SECRET = os.environ.get("SECRET")


router = APIRouter()
oauth2_login = OAuth2PasswordBearer(tokenUrl="login")
crypt = CryptContext(schemes=["bcrypt"])


# AUXILIARY FUNCTIONS


def search_user(field: str, key):
    try:
        user = find_user(field, key)
        return User(**user_schema(user))
    
    except:
        return {"error": "User is not found!"}
    

def search_user_db(field: str, key):
    try:
        user_db = find_user(field, key)
        return UserDB(**user_schema(user_db))
    
    except:
        return {"error": "User is not found!"}
    

async def auth_user(token: str = Depends(oauth2_login)):
    exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not valid credentials.",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        # Get username from token
        username = jwt.decode(token, SECRET, algorithms=[ALGORITHM]).get("sub")

        if username is None:
            raise exception
        
    except JWTError:
        raise exception
    
    return search_user("username", username)


# USERS DEFINITION

# Create a new user -> REGISTER
@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def user(user: UserDB):
    if type(search_user("username", user.username)) == User:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "username",
                "message": "This username already exists!"
            }
        )
    elif type(search_user("email", user.email)) == User:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "email",
                "message": "This email already exists!"
            }
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


# Set a user -> LOGIN
@router.post("/login", status_code=status.HTTP_200_OK)
async def login(form: LoginForm):
    user_db = search_user_db("email", form.email)

    # Check if email exists
    if not type(user_db) == UserDB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "email",
                "message": "This email doesn't exist!"
            }
        )
    
    # Check if password is correct
    if not crypt.verify(form.password, user_db.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "password",
                "message": "The password is not correct!"
            }
        )

    # Token parameters
    access_token = {
        "sub": user_db.username,
        "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_DURATION)
    }

    return {
        "access_token": jwt.encode(access_token, SECRET, algorithm=ALGORITHM),
        "token_type": "bearer"
    }


# Get current user -> GET
@router.get("/users/me")
async def me(user: User = Depends(auth_user)):
    return user