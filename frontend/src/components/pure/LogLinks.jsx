import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext, UserContext } from '../../context/authContext';
import { TYPES } from '../../models/constants';
import { DISPLAY_TYPE } from '../../models/constants';
import { UserBlogsContext } from '../../context/blogsContext';
import PATHS from '../../models/paths';

export const LoginButton = ({ type=TYPES.text }) => {
    // Constants
    const history = useNavigate();

    return (
        <button
            onClick={() => history(PATHS.login)}
            className={'login-btn'}
        >
            {
                DISPLAY_TYPE('Login')[type]
            }
        </button>
    );
};

export const LogoutButton = ({ type=TYPES.textIcon, addClass='' }) => {
    // Constants
    const history = useNavigate();
    // Contexts
    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);
    const { setUserBlogs } = useContext(UserBlogsContext);


    /**
     * Logs the user out when the button is clicked.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser({});
        setUserBlogs([]);
        history(PATHS.welcome);
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