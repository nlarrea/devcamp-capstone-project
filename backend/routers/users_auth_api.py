import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
import base64
import re

from db.models.user import User, UserDB
from db.models.form import LoginForm, EditForm
from db.schemas.user import user_schema
from db.users_database import create_user, find_user_conditional, update_user, delete_user


ALGORITHM = "HS256"
ACCESS_TOKEN_DURATION = 3   # 3 hours
SECRET = os.environ.get("SECRET")


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
oauth2_login = OAuth2PasswordBearer(tokenUrl="login")
crypt = CryptContext(schemes=["bcrypt"])


# AUXILIARY FUNCTIONS


def search_user(field: str, key):
    try:
        user = find_user_conditional(field, key)
        return User(**user_schema(user))
    
    except:
        return {"error": "User is not found!"}
    

def search_user_db(field: str, key):
    try:
        user_db = find_user_conditional(field, key)
        return UserDB(**user_schema(user_db))
    
    except:
        return {"error": "User is not found!"}
    

def check_allowed_data_field(field: str, new_user: EditForm, current_user: User) -> bool:
    user_dict = dict(new_user)
    user = find_user_conditional(field, user_dict[field])

    if not user:
        # There's no user in DB with that field -> it can be set to the new one
        return True
    
    elif user["users_id"] == current_user.id:
        # The field is not modified in new user
        return True
    
    return False


def check_allowed_data(new_user: EditForm, logged_user: User) -> bool:
    # Check if user can use the username
    allow_username = check_allowed_data_field("username", new_user, logged_user)

    # Check if user can use the email
    allow_email = check_allowed_data_field("email", new_user, logged_user)

    # Check if the old password is correct
    user_db = search_user_db("username", logged_user.username)
    correct_email = crypt.verify(new_user.old_password, user_db.password)

    return allow_username and allow_email and correct_email
    

async def auth_user(token: str = Depends(oauth2_login)):
    exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not valid credentials!",
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


def decode_base64(data, alt_chars=b"+/"):
    """ Decode base64, padding being optional.

    Parameters:
        - data: base64 data as an ASCII byte string.
    
    Returns:
        - The decoded byte sting.
    """

    # Normalize
    data = re.sub(rb"[^a-zA-Z0-9%s]+" % alt_chars, b"", data)

    missing_padding = len(data) % 4
    if missing_padding:
        data += b"=" * (4 - missing_padding)

    return base64.b64decode(data, alt_chars)


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


# Set a user -> LOGIN (get access token)
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


# Get current user -> GET (current user)
@router.get("/me")
async def me(user: User = Depends(auth_user)):
    return user


@router.put("/update-me", status_code=status.HTTP_201_CREATED)
async def update_user_data(new_user: EditForm, logged_user: User = Depends(auth_user)):
    if not check_allowed_data(new_user, logged_user):
        return False
    
    # Get logged user's all data:
    user_db = search_user_db("username", logged_user.username)

    if type(user_db) != UserDB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Logged user is not found in database!"
        )

    new_user_dict = dict(new_user)

    # If new user has modified the password, crypt it
    if new_user_dict["new_password"] and new_user_dict["new_password"] != "":
        new_user_dict["new_password"] = crypt.hash(new_user_dict["new_password"])
    
    # Set data to new_user if it doesn't exist to avoid removing data from DB
    new_user_dict["password"] = new_user_dict["new_password"]
    del new_user_dict["new_password"]
    del new_user_dict["old_password"]

    if new_user_dict["image"]:
        new_user_dict["image"] = decode_base64(new_user_dict["image"])

    for field in new_user_dict.keys():
        if ((not new_user_dict[field] or new_user_dict[field] == "")
            and field != "image"):
            new_user_dict[field] = dict(user_db)[field]

    # Update user
    update_user(new_user_dict, user_db.id)
    
    # Update access token
    access_token = {
        "sub": new_user_dict["username"],
        "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_DURATION)
    }

    return {
        "access_token": jwt.encode(access_token, SECRET, algorithm=ALGORITHM),
        "token_type": "bearer"
    }


@router.delete("/remove-account", status_code=status.HTTP_200_OK)
async def remove_current_user(user: User = Depends(auth_user)):
    delete_user(user.id)