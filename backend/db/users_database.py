import os
import psycopg2
import psycopg2.extras
from operator import itemgetter

from db.models.user import UserDB

# Get the database connection details from environment variables
db_host = os.environ.get("DB_HOST")
db_port = os.environ.get("DB_PORT")
db_name = os.environ.get("DB_NAME")
db_user = os.environ.get("DB_USER")
db_password = os.environ.get("DB_PASSWORD")


def database_connect() -> dict:
    """ Creates the connection and cursor to the database and returns them. """

    # Connect to the database
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password,
        sslmode="require"
    )

    # Create a cursor object
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    return {
        "conn": conn, 
        "cur": cur
    }


def database_disconnect(conn, cur):
    """ Disconnect from database. """

    cur.close()
    conn.close()


def find_user(field: str, value) -> dict | None:
    """ Receives a field and the value of the received field and returns the
     database info if it finds the data on it.
     
     Parameters:
        - table_field (`str`): The name of the field to be requested to the
        database.
        - value (`any`): The value of the given field.

     Returns:
        - (`dict` | `None`): A dictionary that contains the found user's data.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

    if type(value) == str:
        cur.execute(
            f"SELECT * FROM users WHERE users_{field} = '{value}'"
        )

    else:       
        cur.execute(
            f"SELECT * FROM users WHERE users_{field} = {value}"
        )

    result = cur.fetchone()

    database_disconnect(conn, cur)

    if result:
        return dict(result)
    
    return None


def create_user(user: UserDB) -> None:
    """ Connects to the database and creates a new record (user) with the
     received data.
     
     Parameters:
        - user (`UserDB`): The user to be created.
    """
    
    conn, cur = itemgetter("conn", "cur")(database_connect())

    # Insert the user into the database
    cur.execute(
        "INSERT INTO users (users_username, users_email, users_password) VALUES (%s, %s, %s)",
        (user["username"], user["email"], user["password"])
    )
    conn.commit()

    # Close the cursor and connection
    database_disconnect(conn, cur)


def update_user(new_user: dict, logged_user_id: int) -> None:
    """ Updates a user's data by replacing the existing one with the new data.
    
     Parameters:
        - new_user (`dict`): The user's updated data.
        - logged_user_id (`int`): The current user's ID.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

    if new_user["image"]:
        cur.execute(
            """UPDATE users SET
            users_username = %s,
            users_email = %s,
            users_password = %s,
            users_image = %s
            WHERE users_id = %s;""",
            (new_user["username"], new_user["email"], new_user["password"], new_user["image"], logged_user_id)
        )

    else:
        cur.execute(
            """UPDATE users SET
            users_username = %s,
            users_email = %s,
            users_password = %s,
            users_image = null
            WHERE users_id = %s;""",
            (new_user["username"], new_user["email"], new_user["password"], logged_user_id)
        )

    conn.commit()

    database_disconnect(conn, cur)


def delete_user(user_id: int) -> None:
    """ Removes a user from database.
    
     Parameters:
        - user_id (`int`): The ID of the user that has to be removed.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

    # Remove current user's blogs to avoid FK error
    cur.execute(
        f"DELETE FROM blogs WHERE blogs_users_id = {user_id}"
    )
    conn.commit()

    # Remove user itself
    cur.execute(
        f"DELETE FROM users WHERE users_id = {user_id}"
    )
    conn.commit()

    database_disconnect(conn, cur)