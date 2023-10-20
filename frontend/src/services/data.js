import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/blogs/';


const getUserBlogs = async (userId) => {
    const storedToken = localStorage.getItem('token');

    const userBlogs = await axios.get(
        API_URL + userId, {
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


const updateBlog = async (updatedBlog) => {
    const storedToken = localStorage.getItem('token');

    await axios.put(
        API_URL + 'edit-blog',
        updateBlog, {
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
    getUserBlogs,
    getSingleBlog,
    updateBlog,
    deleteBlog
};

export default DataService;