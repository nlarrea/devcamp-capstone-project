def user_schema(user) -> dict:
    if user["users_image"] is None:
        user["users_image"] = ""
        
    return {
        "id": user["users_id"],
        "username":  user["users_username"],
        "email": user["users_email"],
        "password": user["users_password"],
        "image": user["users_image"]
    }


def users_schema(users) -> list:
    return [user_schema(user) for user in users]