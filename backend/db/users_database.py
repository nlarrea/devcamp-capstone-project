import os
import psycopg2
import psycopg2.extras

from db.models.user import User, UserDB

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
    cur = conn.cursor()

    # Execute a query
    cur.execute("SELECT * FROM users LIMIT 10")

    # Fetch the results
    results = cur.fetchall()

    # Close the cursor and connection
    cur.close()
    conn.close()

    # Return the results
    return results


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
        "INSERT INTO users (users_username, users_email, users_image, users_password) VALUES (%s, %s, %s, %s)",
        (user["username"], user["email"], user["image"], user["password"])
    )
    conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()