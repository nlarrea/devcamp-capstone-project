import base64

def user_schema(user) -> dict:
    if user["image"]:
        user["image"] = base64.b64encode(user["image"])
        
    return {
        "id": str(user["_id"]),
        "username":  user["username"],
        "email": user["email"],
        "password": user["password"],
        "image": user["image"]
    }


def users_schema(users) -> list:
    return [user_schema(user) for user in users]