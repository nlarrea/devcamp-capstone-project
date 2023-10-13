import os
import psycopg2
import psycopg2.extras

from db.models.blog import Blog

# Get the database connection details from environment variables
db_host = os.environ.get("DB_HOST")
db_port = os.environ.get("DB_PORT")
db_name = os.environ.get("DB_NAME")
db_user = os.environ.get("DB_USER")
db_password = os.environ.get("DB_PASSWORD")


def get_blogs():
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
    cur.execute("SELECT * FROM blogs LIMIT 10")

    # Fetch the results
    results = cur.fetchall()

    # Close the cursor and connection
    cur.close()
    conn.close()

    return results


def create_blog(blog: dict):
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

    cur.execute(
        """INSERT INTO blogs (blogs_title, blogs_content, blogs_users_id, blogs_banner_img)
        VALUES (%s, %s, %s, %s)""",
        (blog["title"], blog["content"], blog["user_id"], blog["banner_img"])
    )
    conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()