import React from 'react';
import { NavLink } from 'react-router-dom';

import { TYPES } from '../../models/constants';
import { LoginButton, LogoutButton } from './LogLinks';

const NavBar = ({ isAuthenticated, user }) => {
    return (
        <nav>
            <div className='left-nav-side'>
                <div className='link-wrapper'>
                    <NavLink to='/'>Home</NavLink>
                </div>

                <div className='link-wrapper'>
                    <NavLink to='/blogs'>Blogs</NavLink>
                </div>
                {
                    isAuthenticated && (
                        <div className='link-wrapper'>
                            <NavLink to='/blogs/new-blog'>New Blog</NavLink>
                        </div>
                    )
                }
            </div>

            <div className='right-nav-side'>
                {
                    isAuthenticated ? (
                        <>
                            <div className='link-wrapper'>
                                <NavLink to={`/users/me`} className='user-link'>
                                    <img
                                        src={user?.picture || ''}
                                        alt={user?.nickname || 'user'}
                                        id='logged-user-nav-img'
                                        />
                                    <span>{user?.nickname || 'my name'}</span>
                                </NavLink>
                            </div>

                            <div className='link-wrapper'>
                                <LogoutButton type={TYPES.iconText} />
                            </div>
                        </>
                    ) : (
                        <div className='link-wrapper'>
                            <LoginButton type={TYPES.text} />
                        </div>
                    )
                }
            </div>
            </nav>
    );
};


export default NavBar;