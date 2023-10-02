import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
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
                    <NavLink to='/login'>Login</NavLink>
                </div>
            </nav>
        </footer>
    );
};


export default Footer;