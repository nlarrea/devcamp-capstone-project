import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import avatar from '../../static/images/avatars/male_avatar.svg';
import AuthContext from '../../context/authContext';
import { TYPES } from '../../models/constants';
import { LoginButton, LogoutButton } from './LogLinks';

const NavBar = ({ user }) => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <nav id='navbar-component-wrapper'>
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
                            <NavLink to={`/users/me`} className='nav-user-data-wrapper'>
                                <div className='nav-user-img-wrapper'>
                                    <span className='nav-user-circle-out' />
                                    <span className='nav-user-circle-in' />
                                    <img
                                        src={user?.picture || avatar}
                                        alt={user?.nickname || 'user'}
                                        id='logged-user-nav-img'
                                    />
                                </div>
                            </NavLink>

                            <div className='link-wrapper nav-username-link'>
                                <NavLink to={'/users/me'}>
                                    {user?.nickname || 'my username'}
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