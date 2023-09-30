# CÓDIGO DE EJEMPLO sobre cómo conectar con la base de datos

import os
import psycopg2

# Get the database connection details from environment variables
db_host = os.environ.get("DB_HOST")
db_port = os.environ.get("DB_PORT")
db_name = os.environ.get("DB_NAME")
db_user = os.environ.get("DB_USER")
db_password = os.environ.get("DB_PASSWORD")


def get_users():
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
    cur.execute("SELECT * FROM users")

    # Fetch the results
    results = cur.fetchall()

    # Close the cursor and connection
    cur.close()
    conn.close()

    # Return the results
    return results


def create_user(username, email, password):
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
        "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
        (username, email, password)
    )
    conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()