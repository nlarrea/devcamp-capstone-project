import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

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
                console.log('width:', windowWidth, '. SMALL');
                setIsSmallMedia(true);
            } else {
                console.log('width:', windowWidth, '. BIG');
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
                <NavLink to='/'>Home</NavLink>
            </div>

            <div className='link-wrapper'>
                <NavLink to='/blogs'>Blogs</NavLink>
            </div>
            
            {
                isAuthenticated && (
                    <div className='link-wrapper'>
                        <NavLink to='/new-blog'>New Blog</NavLink>
                    </div>
                ) 
            }
            {
                isAuthenticated && isSmallMedia && (
                    <div className='link-wrapper nav-username-link'>
                        <NavLink to='/users/me'>
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