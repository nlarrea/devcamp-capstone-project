import axios from "axios";

import { API_PATHS } from "../models/paths";


const register = async ({ username, email, password }) => {
    return await axios.post(
        API_PATHS.users.register,
        {
            username,
            email,
            password
        }
    );
};


const login = async ({ email, password }) => {
    const response = await axios.post(
        API_PATHS.users.login,
        {
            email,
            password
        }
    );

    return response.data;
};


const logout = () => {
    localStorage.removeItem('token');
};


const getCurrentUser = () => {
    const storedToken = localStorage.getItem('token');

    return axios.get(
        API_PATHS.users.me, {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true
        }
    );
};


const updateUser = async ({
    username,
    email,
    old_password,
    new_password,
    image
}) => {
    const storedToken = localStorage.getItem('token');

    return await axios.put(
        API_PATHS.users.updateMe,
        {
            username,
            email,
            old_password,
            new_password,
            image
        }, {
            headers: { Authorization: `Bearer ${storedToken}`},
            withCredentials: true
        }
    );
};


const removeAccount = async () => {
    const storedToken = localStorage.getItem('token');

    await axios.delete(
        API_PATHS.users.removeAccount, {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true
        }
    );
};


const AuthService = {
    register,
    login,
    updateUser,
    logout,
    getCurrentUser,
    removeAccount
};

export default AuthService;