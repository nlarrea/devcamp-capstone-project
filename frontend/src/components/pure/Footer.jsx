import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/authContext';
import { TYPES } from '../../models/constants';
import { LoginButton, LogoutButton } from './LogLinks';
import PATHS from '../../models/paths';

const Footer = () => {
    // Context
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <footer id='footer-component-wrapper'>
            <header>
                <h2>Blog Voyage</h2>
                <p>Let your imagination fly!</p>
            </header>

            <nav>
                <div className='link-wrapper'>
                    <NavLink to={PATHS.blogs}>Blogs</NavLink>
                </div>

                <div className='link-wrapper'>
                    <a 
                        href='https://github.com/nlarrea/devcamp-capstone-project'
                        target='_blank'
                        rel='noreferrer'
                    >Source Code</a>
                </div>

                <div className='link-wrapper'>
                    {
                        isAuthenticated ? (
                            <LogoutButton type={TYPES.text} />
                        ) : (
                            <LoginButton type={TYPES.text} />
                        )
                    }
                </div>
            </nav>
        </footer>
    );
};


export default Footer;