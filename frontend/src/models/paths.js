/**
 * The base path of the app.
 */
// const mainPath = 'blog-voyage';


/**
 * Paths of the application
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