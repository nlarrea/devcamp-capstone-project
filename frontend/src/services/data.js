import axios from "axios";

const API_URL = 'https://blog-voyage-api-dev-femc.1.ie-1.fl0.io/blogs/';


const createBlog = async (newBlog) => {
    const storedToken = localStorage.getItem('token');

    const createdBlog = await axios.post(
        API_URL + 'new-blog',
        newBlog, {
            headers: { Authorization: `Bearer ${storedToken}` }
        }
    );

    return createdBlog;
};


const getUserBlogs = async (userId, page) => {
    const storedToken = localStorage.getItem('token');

    const userBlogs = await axios.get(
        API_URL + `user/${userId}?page=${page}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
        }
    );

    return userBlogs;
};


const getSingleBlog = async (blogId) => {
    const obtainedBlog = await axios.get(
        API_URL + `single-blog/${blogId}`
    );

    return obtainedBlog;
};


const getAllBlogs = async (page) => {
    const obtainedBlogs = await axios.get(
        API_URL + `all-blogs?page=${page}`
    );

    return obtainedBlogs;
}


const updateBlog = async (updatedBlog) => {
    const storedToken = localStorage.getItem('token');

    return await axios.put(
        API_URL + 'edit-blog',
        updatedBlog, {
            headers: { Authorization: `Bearer ${storedToken}` }
        }
    );
};


const deleteBlog = async (blogId) => {
    const storedToken = localStorage.getItem('token');

    const removedBlogId = await axios.delete(
        API_URL + `remove-blog/${blogId}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
        }
    );

    return removedBlogId;
};


const DataService = {
    createBlog,
    getUserBlogs,
    getSingleBlog,
    getAllBlogs,
    updateBlog,
    deleteBlog
};

export default DataService;