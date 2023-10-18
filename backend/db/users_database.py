import os
import psycopg2
import psycopg2.extras

from db.models.user import UserDB

# Get the database connection details from environment variables
db_host = os.environ.get("DB_HOST")
db_port = os.environ.get("DB_PORT")
db_name = os.environ.get("DB_NAME")
db_user = os.environ.get("DB_USER")
db_password = os.environ.get("DB_PASSWORD")


def get_all_users():
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

    # Execute a query
    cur.execute("SELECT * FROM users LIMIT 10")

    # Fetch the results
    results = cur.fetchall()

    # Close the cursor and connection
    cur.close()
    conn.close()

    # Return the results
    return results


def get_all_users_conditional(field: str, key) -> list | None:
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

    if type(key) == str:
        cur.execute(
            f"SELECT * FROM users WHERE users_{field} = '{key}'"
        )

    else:       
        cur.execute(
            f"SELECT * FROM users WHERE users_{field} = {key}"
        )

    results = cur.fetchall()

    if results:
        results = [dict(record) for record in results]
        return results
    
    return None


def find_user(table_field: str, value) -> dict | None:
    """ Receives a field and the value of the received field and returns the
     database info if it finds the data on it. """
    
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

    # Execute a query
    cur.execute(f"SELECT * FROM users WHERE users_{table_field} = '{value}'")
    record = cur.fetchone()

    # Close the cursor and connection
    cur.close()
    conn.close()

    # Return the result
    if record:
        return dict(record)
    
    return None


def find_user_conditional(field: str, key) -> dict | None:
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

    if type(key) == str:
        cur.execute(
            f"SELECT * FROM users WHERE users_{field} = '{key}'"
        )

    else:       
        cur.execute(
            f"SELECT * FROM users WHERE users_{field} = {key}"
        )

    result = cur.fetchone()

    if result:
        return dict(result)
    
    return None


def create_user(user: UserDB):
    """ Connects to the database and creates a new record (user) with the
     received data. """
    
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
    cur = conn.cursor()

    # Insert the user into the database
    cur.execute(
        "INSERT INTO users (users_username, users_email, users_password) VALUES (%s, %s, %s)",
        (user["username"], user["email"], user["password"])
    )
    conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()


def update_user(new_user: dict, logged_user_id: int):
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

    cur.close()
    conn.close()


def delete_user(user_id: int):
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

    cur.close()
    conn.close()