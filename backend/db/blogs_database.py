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


def get_blogs(skip: int, limit: int):
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
    cur.execute(
        f"""SELECT * FROM blogs
        ORDER BY blogs_id DESC
        LIMIT {limit} OFFSET {skip}"""
    )

    # Fetch the results
    results = cur.fetchall()

    # Close the cursor and connection
    cur.close()
    conn.close()

    if results:
        # Create a list of objects
        results = [dict(obj) for obj in results]
        return results
    
    return None


def find_blog(blog_id: int) -> dict:
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

    cur.execute(
        f"SELECT * FROM blogs WHERE blogs_id = {blog_id}"
    )
    result = cur.fetchone()

    cur.close()
    conn.close()

    if result:
        return dict(result)
    
    return None


def find_users_blogs(user_id: int) -> list:
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

    cur.execute(f"SELECT * FROM blogs WHERE blogs_users_id = {user_id} ORDER BY blogs_id DESC")
    results = cur.fetchall()


    cur.close()
    conn.close()

    if results:
        # Create a list of objects
        results = [dict(obj) for obj in results]

        return results
    
    return None


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

    if blog["banner_img"]:
        insert_image = psycopg2.Binary(blog["banner_img"])

        cur.execute(
            """INSERT INTO blogs (blogs_title, blogs_content, blogs_users_id, blogs_banner_img)
            VALUES (%s, %s, %s, %s)""",
            (blog["title"], blog["content"], blog["user_id"], insert_image)
        )
    else:
        cur.execute(
            """INSERT INTO blogs (blogs_title, blogs_content, blogs_users_id)
            VALUES (%s, %s, %s)""",
            (blog["title"], blog["content"], blog["user_id"])
        )

    conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()


def update_blog(blog: dict, blog_id: int):
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

    if blog["banner_img"]:
        cur.execute(
            """UPDATE blogs SET
            blogs_title = %s,
            blogs_content = %s,
            blogs_users_id = %s,
            blogs_banner_img = %s
            WHERE blogs_id = %s;""",
            (blog["title"], blog["content"], blog["user_id"], blog["banner_img"], blog_id)
        )

    else:
        cur.execute(
            """UPDATE blogs SET
            blogs_title = %s,
            blogs_content = %s,
            blogs_users_id = %s,
            blogs_banner_img = null
            WHERE blogs_id = %s;""",
            (blog["title"], blog["content"], blog["user_id"], blog_id)
        )

    conn.commit()

    # CLose the cursor and connection
    cur.close()
    conn.close()


def delete_blog(blog_id: int):
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
        f"DELETE FROM blogs WHERE blogs_id = {blog_id}"
    )
    conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()