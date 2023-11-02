/**
 * Paths of the frontend part of the application.
 */
const PATHS = {
    welcome: `/`,
    login: `/login`,
    register: `/register`,
    blogs: `/blogs`,
    blogPage: (blogId) => `/blogs/${blogId}`,
    newBlog: `/new-blog`,
    editBlog: (blogId) => `/edit-blog/${blogId}`,
    currentUser: `/users/me`,
    editUser: `/users/me/edit`
};

export default PATHS;


// The API URL to connect to the database
const apiUrl = 'https://blog-voyage-api-dev-femc.1.ie-1.fl0.io';

/**
 * Paths of the backend endpoints to send requests to the database.
 */
export const API_PATHS = {
    users: {
        register: `${apiUrl}/users/register`,
        login: `${apiUrl}/users/login`,
        me: `${apiUrl}/users/me`,
        updateMe: `${apiUrl}/users/update-me`,
        removeAccount: `${apiUrl}/users/remove-account`
    },
    blogs: {
        newBlog: `${apiUrl}/blogs/new-blog`,
        getUserBlogs: (userId, page) => `${apiUrl}/blogs/user/${userId}?page=${page}`,
        getSingleBlog: (blogId) => `${apiUrl}/blogs/single-blog/${blogId}`,
        getAllBlogs: (page) => `${apiUrl}/blogs/all-blogs?page=${page}`,
        updateBlog: `${apiUrl}/blogs/edit-blog`,
        deleteBlog: (blogId) => `${apiUrl}/blogs/remove-blog/${blogId}`
    }
};