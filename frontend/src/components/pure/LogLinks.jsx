import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext, UserContext } from '../../context/authContext';
import { TYPES } from '../../models/constants';
import { DISPLAY_TYPE } from '../../models/constants';
import { UserBlogsContext } from '../../context/blogsContext';

export const LoginButton = ({ type=TYPES.text }) => {
    const history = useNavigate();

    return (
        <button
            onClick={() => history('/login')}
            className={'login-btn'}
        >
            {
                DISPLAY_TYPE('Login')[type]
            }
        </button>
    );
};

export const LogoutButton = ({ type=TYPES.textIcon, addClass='' }) => {
    const history = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);
    const { setUserBlogs } = useContext(UserBlogsContext);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser({});
        setUserBlogs([]);
        history('/')
    }

    return (
        <button
            onClick={handleLogout}
            className={`logout-btn ${addClass}`}
        >
            {
                DISPLAY_TYPE('Log out', 'right-from-bracket')[type]
            }
        </button>
    );
};