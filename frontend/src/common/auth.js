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


const logout = () => {
    localStorage.removeItem('token');
}


const getCurrentUser = () => {
    const storedToken = localStorage.getItem('token');

    return axios.get(
        API_URL + 'me', {
            headers: { Authorization: `Bearer ${storedToken}` }
        }
    );
};


const AuthService = {
    register,
    login,
    logout,
    getCurrentUser
};

export default AuthService;