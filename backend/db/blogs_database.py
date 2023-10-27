import os
import psycopg2
import psycopg2.extras
from operator import itemgetter

from db.models.blog import Blog

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


def get_total_of_blogs(user_id: int | None = None) -> int | None:
    """ Requests to the database the amount of blogs.
    
     Parameters:
        - user_id (`int`): User's ID to search its amount of blogs.

     Returns:
        - (`int` | `None`): The total count of found blogs.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

    if not user_id:
        cur.execute("SELECT COUNT(*) FROM blogs;")
        result = cur.fetchone()
    else:
        cur.execute(
            f"SELECT COUNT(*) FROM blogs where blogs_users_id = {user_id}"
        )
        result = cur.fetchone()

    database_disconnect(conn, cur)

    if result:
        return result[0]
    
    return None


def get_blogs(offset: int, limit: int, user_id: int | None = None) -> list[dict] | None:
    """ Gets a specified range of blogs.
    
     Parameters:
        - offset (`int`): The first blog position in the database to be
        returned.
        - limit (`int`): The quantity of blogs to be requested.
        - user_id (`int` | `None`): The current user's ID.

     Returns:
        - (`list` | `None`): If blogs are found, returns a list of blogs, else
        it returns `None`.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

    # Execute a query
    if not user_id:
        cur.execute(
            f"""SELECT * FROM blogs
            ORDER BY blogs_id DESC
            LIMIT {limit} OFFSET {offset}"""
        )
    else:
        cur.execute(
            f"""SELECT * FROM blogs
            WHERE blogs_users_id = {user_id}
            ORDER BY blogs_id DESC
            LIMIT {limit} OFFSET {offset}"""
        )

    # Fetch the results
    results = cur.fetchall()

    # Close the cursor and connection
    database_disconnect(conn, cur)

    if results:
        # Create a list of objects
        results = [dict(obj) for obj in results]
        return results
    
    return None


def find_blog(blog_id: int) -> dict:
    """ Finds a single blog by its ID.

     Parameters:
        - blog_id (`int`): The ID of the blog to be requested.
    
     Returns:
        - (`dict`): The blog that matches the received blog ID.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

    cur.execute(
        f"SELECT * FROM blogs WHERE blogs_id = {blog_id}"
    )
    result = cur.fetchone()

    database_disconnect(conn, cur)

    if result:
        return dict(result)
    
    return None


def find_users_blogs(user_id: int) -> list[dict] | None:
    """ Returns all the blogs of a specified user.

     Parameters:
        - user_id (`int`): The ID of the user.

     Returns:
        - (`list` | `None`): If blogs are found, returns a list of blogs, else
        it returns `None`.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

    cur.execute(f"SELECT * FROM blogs WHERE blogs_users_id = {user_id} ORDER BY blogs_id DESC")
    results = cur.fetchall()

    database_disconnect(conn, cur)

    if results:
        # Create a list of objects
        results = [dict(obj) for obj in results]

        return results
    
    return None


def create_blog(blog: dict) -> None:
    """ Inserts the received blog into the database.
    
     Parameters:
        - blog (`dict`): The blog that has to be inserted into the database.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

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
    database_disconnect(conn, cur)


def update_blog(blog: dict, blog_id: int):
    """ Updates a blog replacing its content with the received blog data.
    
     Parameters:
        - blog (`dict`): The blog's new data.
        - blog_id (`int`): The ID of the blog that has to be updated.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

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
    database_disconnect(conn, cur)


def delete_blog(blog_id: int):
    """ Removes a blog from the database.
    
     Parameters:
        - blog_id (`int`): The ID of the blog that is going to be removed.
    """

    conn, cur = itemgetter("conn", "cur")(database_connect())

    cur.execute(
        f"DELETE FROM blogs WHERE blogs_id = {blog_id}"
    )
    conn.commit()

    # Close the cursor and connection
    database_disconnect(conn, cur)