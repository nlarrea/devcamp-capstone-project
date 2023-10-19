import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/users/';


const register = ({ username, email, password }) => {
    return axios.post(
        API_URL + 'register',
        {
            username,
            email,
            password
        }
    );
};


const login = async ({ email, password }) => {
    const response = await axios.post(
        API_URL + 'login',
        {
            email,
            password
        }
    );

    return response.data;
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
        API_URL + 'update-me',
        {
            username,
            email,
            old_password,
            new_password,
            image
        }, {
            headers: { Authorization: `Bearer ${storedToken}`}
        }
    );
};


const logout = () => {
    localStorage.removeItem('token');
};


const getCurrentUser = () => {
    const storedToken = localStorage.getItem('token');

    return axios.get(
        API_URL + 'me', {
            headers: { Authorization: `Bearer ${storedToken}` }
        }
    );
};


const removeAccount = async () => {
    const storedToken = localStorage.getItem('token');

    return await axios.delete(
        API_URL + 'remove-account', {
            headers: { Authorization: `Bearer ${storedToken}` }
        }
    );
}


const AuthService = {
    register,
    login,
    updateUser,
    logout,
    getCurrentUser,
    removeAccount
};

export default AuthService;