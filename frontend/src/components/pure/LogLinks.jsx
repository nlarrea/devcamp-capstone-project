import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../context/authContext';
import { DISPLAY_TYPE } from '../../models/constants';

export const LoginButton = ({ type='text' }) => {
    const history = useNavigate();

    const setIcon = type === 'textIcon' || type === 'iconText';

    return (
        <button
            onClick={() => history('/login')}
            className={`login-btn ${setIcon && 'icon-text-wrapper'}`}
        >
            {
                DISPLAY_TYPE('Login')[type]
            }
        </button>
    );
};

export const LogoutButton = ({ type='text-icon' }) => {
    const setIcon = type === 'textIcon' || type === 'iconText';
    const { setIsAuthenticated } = useContext(AuthContext);

    return (
        <button
            onClick={() => setIsAuthenticated(false)}
            className={`logout-btn ${setIcon && 'icon-text-wrapper'}`}
        >
            {
                DISPLAY_TYPE('Log out', 'right-from-bracket')[type]
            }
        </button>
    );
};