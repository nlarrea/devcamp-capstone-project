import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/authContext';
import { TYPES } from '../../models/constants';
import { DISPLAY_TYPE } from '../../models/constants';

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

    const handleLogout = () => {
        setIsAuthenticated(false);
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