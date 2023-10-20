import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { AuthContext } from '../../context/authContext';
import { TYPES } from '../../models/constants';
import avatar from '../../static/images/avatars/user_avatar.svg';
import { LoginButton, LogoutButton } from './LogLinks';

const NavBar = ({ user }) => {
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext);

    // Don't show NavBar when user in BlogPage
    const regex = /[\/blogs\/]+(\d+)$/g;    // eslint-disable-line
    if (location.pathname.match(regex)) {
        return (<></>);
    }

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
                            <NavLink to='/new-blog'>New Blog</NavLink>
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
                                    {
                                        user?.image ? (
                                            <div
                                                id='logged-user-nav-img'
                                                style={{
                                                    backgroundImage: `url(${user?.image.replace('dataimage/jpegbase64', 'data:image/jpeg;base64,')})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    borderRadius: '50%'
                                                }}
                                            />
                                        ) : (
                                            <img
                                                id='logged-user-nav-img'
                                                src={avatar}
                                                alt="user avatar"
                                            />
                                        )
                                    }
                                </div>
                            </NavLink>

                            <div className='link-wrapper nav-username-link'>
                                <NavLink to={'/users/me'}>
                                    {user?.username || 'my username'}
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