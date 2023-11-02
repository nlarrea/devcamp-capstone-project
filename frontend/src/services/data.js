import axios from "axios";

import { API_PATHS } from "../models/paths";


const createBlog = async (newBlog) => {
    const storedToken = localStorage.getItem('token');

    const createdBlog = await axios.post(
        API_PATHS.blogs.newBlog,
        newBlog, {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true
        }
    );

    return createdBlog;
};


const getUserBlogs = async (userId, page) => {
    const storedToken = localStorage.getItem('token');

    const userBlogs = await axios.get(
        API_PATHS.blogs.getUserBlogs(userId, page), {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true
        }
    );

    return userBlogs;
};


const getSingleBlog = async (blogId) => {
    const obtainedBlog = await axios.get(
        API_PATHS.blogs.getSingleBlog(blogId)
    );

    return obtainedBlog;
};


const getAllBlogs = async (page) => {
    const obtainedBlogs = await axios.get(
        API_PATHS.blogs.getAllBlogs(page)
    );

    return obtainedBlogs;
}


const updateBlog = async (updatedBlog) => {
    const storedToken = localStorage.getItem('token');

    return await axios.put(
        API_PATHS.blogs.updateBlog,
        updatedBlog, {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true
        }
    );
};


const deleteBlog = async (blogId) => {
    const storedToken = localStorage.getItem('token');

    const removedBlogId = await axios.delete(
        API_PATHS.blogs.deleteBlog(blogId), {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true
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