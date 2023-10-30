import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import PATHS from '../../../models/paths';

const NavLinks = ({ isAuthenticated, isOpen=false, user={} }) => {
    const [isSmallMedia, setIsSmallMedia] = useState(window.innerWidth <= 775);


    /**
     * Event listener to check the window size. If window width is less than
     * 775px, then the username is shown on the NavLinks component.
     */
    useEffect (() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;

            if (windowWidth <= 775) {
                setIsSmallMedia(true);
            } else {
                setIsSmallMedia(false);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);


    return (
        <div className={`left-nav-side ${isOpen ? 'open-modal' : ''}`}>
            <span className="nav-triangle-up"></span>

            <div className='link-wrapper'>
                <NavLink to={PATHS.welcome}>Home</NavLink>
            </div>

            <div className='link-wrapper'>
                <NavLink to={PATHS.blogs}>Blogs</NavLink>
            </div>
            
            {
                isAuthenticated && (
                    <div className='link-wrapper'>
                        <NavLink to={PATHS.newBlog}>New Blog</NavLink>
                    </div>
                ) 
            }
            {
                isAuthenticated && isSmallMedia && (
                    <div className='link-wrapper nav-username-link'>
                        <NavLink to={PATHS.currentUser}>
                            <FontAwesomeIcon icon='user' fixedWidth />
                            {user?.username}
                        </NavLink>
                    </div>
                )
            }
        </div>
    );
};


export default NavLinks;