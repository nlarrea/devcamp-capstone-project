import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/authContext';
import { TYPES } from '../../models/constants';
import { LoginButton, LogoutButton } from './LogLinks';

const Footer = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const getYear = new Date().getUTCFullYear();

    return (
        <footer id='footer-component-wrapper'>
            <header>
                <h2>Blog Voyage</h2>
                <p>Copyright &copy; {getYear} Blog Voyage, Inc.</p>
            </header>

            <nav>
                <div className='link-wrapper'>
                    <NavLink to='/blogs'>Blogs</NavLink>
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