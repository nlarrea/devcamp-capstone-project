import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavLinks = ({ isAuthenticated, isOpen=false, user={}, handleModalState }) => {
    return (
        <div
            className={`left-nav-side ${isOpen ? 'open-modal' : ''}`}
            onClick={handleModalState}
        >
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
                isAuthenticated && isOpen && (
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