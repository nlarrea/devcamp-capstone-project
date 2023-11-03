# Blog Voyage - DevCamp Capstone Project

[Blog Voyage](https://nlarrea.github.io/blog-voyage) is a blog website where you can let your **imagination run wild** by reading and writing about anything you want. It is a place where you can **share your experiences and stories** with the world. You can also **read about other people's** experiences and stories!

This is the backend repository for the **blog website**. This project is the **final project for the DevCamp program**, a 10 month full-stack course. The project is built using **React as the frontend** framework and **Python with FastAPI as the backend**, and a **MongoDB database** is used to store the data.


## How the backend works

The backend is built using Python with FastAPI. The backend is hosted on [fl0](https://app.fl0.com/) and the database is hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). The backend is connected to the frontend using axios.

The backend has the following endpoints:

### POST

* `/users/register` - Registers a new user.
* `/users/login` - Logs in a user.
* `/blogs/new-blog` - Creates a new blog.

### GET

* `/users/me` - Gets the user's information.
* `/blogs/users/{user_id}` - Gets the blogs from a user.
* `/blogs/all-blogs` - Gets all the blogs.
* `/blogs/single-blog/{blog_id}` - Gets a single blog.

### PUT

* `/users/update-me` - Updates the user's information.
* `/blogs/edit-blog` - Edits a blog.

### DELETE

* `/users/remove-account` - Removes the user's account.
* `/blogs/remove-blog/{blog_id}` - Removes a blog.


## Who can use the backend?

Anyone can use the backend, but it is meant to be used by the frontend. The backend is not meant to be used by itself, but it can be used by anyone who wants to use it.

Some of the endpoints are protected, so you need to be logged in to use them. If you are not logged in, you will get an error message.


## Contributing

As I said, this is a final project for the DevCamp program. If you want to contribute to the project, you can fork the repository and make your own changes. If you want to make a pull request, you can do so, but **I will not be accepting any pull requests before the end of the program** (*on November 10th, 2023*).