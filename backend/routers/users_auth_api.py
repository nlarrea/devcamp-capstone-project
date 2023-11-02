import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from bson import ObjectId
import base64
import re

from db.client import db_client
from db.models.user import User, UserDB
from db.models.form import LoginForm, EditForm
from db.schemas.user import user_schema


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

def search_user(field: str, value) -> User | dict:
    """ Searches for a user collection in the database based on a specific
     field and its value.
    
     Parameters:
        - field (`str`): The name of the field by which to find the user in the
        database.
        - value (`any`): The value of the given field.

     Returns:
        - (`User` | `dict`): Returns a `User` object if the user is found in
        the database. Otherwise, it returns a `dict` with a error message.
    """

    try:
        user = db_client.users.find_one({field: value})
        return User(**user_schema(user))
    except:
        return {"error": "User is not found!"}
    

def search_user_db(field: str, value) -> UserDB | dict:
    """ Searches for a user collection in the database based on a specific
     field and its value.
    
     Parameters:
        - field (`str`): The name of the field by which to find the user in the
        database.
        - value (`any`): The value of the given field.

     Returns:
        - (`UserDB` | `dict`): Returns a `User` object if the user is found in
        the database. Otherwise, it returns a `dict` with a error message.
    """

    try:
        user_db = db_client.users.find_one({field: value})
        return UserDB(**user_schema(user_db))
    except:
        return {"error": "User is not found!"}
    

def check_allowed_data_field(field: str, new_user: EditForm, current_user: User) -> bool:
    """ Checks if the given field can be set into the database or if it already
     exists to avoid rewriting other's data.
     
     Parameters:
        - field (`str`): The data name to be checked in the database.
        - new_user (`EditForm`): The user's updated data.
        - current_user (`User`): The current user's data.
    """

    user_dict = dict(new_user)
    user = search_user(field, user_dict[field])

    if type(user) != User:
        # There's no user in DB with that field -> it can be set to the new one
        return True
    
    elif user.id == current_user.id:
        # The field is not modified in new user
        return True
    
    return False


def check_allowed_data(new_user: EditForm, logged_user: User) -> bool:
    """ Checks if the given data can be set into the database or if it already
     exists to avoid rewriting other's data.
     
     Parameters:
        - new_user (`EditForm`): The user's updated data.
        - current_user (`User`): The current user's data.
    """

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


def decode_base64(data, alt_chars=b"+/") -> bytes:
    """ Decode base64, padding being optional.

    Parameters:
        - data: base64 data as an ASCII byte string.
    
    Returns:
        - (`bytes`): The decoded byte sting.
    """

    # Normalize
    data = re.sub(rb"[^a-zA-Z0-9%s]+" % alt_chars, b"", data)

    missing_padding = len(data) % 4
    if missing_padding:
        data += b"=" * (4 - missing_padding)

    return base64.b64decode(data, alt_chars)


# USERS DEFINITION


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserDB):
    """ Creates a new user into the database. First hashes the user's password
     before it is stored.
     
     Parameters:
        - user (`UserDB`): The user data to be stored into the database.

     Returns:
        - (`User`): The user that has been stored into the database.
    """

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
    user_dict["image"] = b""
    del user_dict["id"]

    # Insert the new username to database and get its ID
    id = db_client.users.insert_one(user_dict).inserted_id

    # Check if the current user has been correctly inserted
    new_user = user_schema(
        db_client.users.find_one({"_id": id})
    )

    return User(**new_user)


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(form: LoginForm):
    """ Validates the form's credentials and returns the user's access token.
    
     Parameters:
        - form (`LoginForm`): The login form data.

     Returns:
        - (`dict`): A dictionary containing the access token and the type of
        this token.
    """

    user_db = search_user_db("email", form.email)

    # Check if the email exists
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


@router.get("/me")
async def me(user: User = Depends(auth_user)):
    """ Returns the logged user's data.
    
     Returns:
        - user (`User`): The current user's data.
    """

    return user


@router.put("/update-me", status_code=status.HTTP_201_CREATED)
async def update_user_data(new_user: EditForm, logged_user: User = Depends(auth_user)):
    """ Updates the current user's data.
    
     Parameters:
        - new_user (`EditForm`): The updated data from the user.

     Returns:
        - (`dict`): A dictionary containing the access token and the type of
        the token.
    """

    if not check_allowed_data(new_user, logged_user):
        return False
    
    # Get logged user's all data
    user_db = search_user_db("username", logged_user.username)

    if type(user_db) != UserDB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Logged user is not found in database!"
        )
    
    new_user_dict = dict(new_user)

    # If updated user has modified the password, crypt it
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

    # Update the user
    try:
        db_client.users.find_one_and_replace({"_id": ObjectId(logged_user.id)}, new_user_dict)
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User couldn't be found!"
        )
    
    # Update access token
    access_token = {
        "sub": new_user_dict["username"],
        "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_DURATION)
    }

    return {
        "access_token": jwt.encode(access_token, SECRET, algorithm=ALGORITHM),
        "token_type": "Bearer"
    }


@router.delete("/remove-account", status_code=status.HTTP_200_OK)
async def remove_current_user(user: User = Depends(auth_user)):
    """ Removes the current user from the database. """

    # Remove the current user
    found_user = db_client.users.find_one_and_delete({"_id": ObjectId(user.id)})

    if not found_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not deleted!"
        )
    
    # Remove the current user's blogs
    db_client.blogs.delete_many({"user_id": user.id})