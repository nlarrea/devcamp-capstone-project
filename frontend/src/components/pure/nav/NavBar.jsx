import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { AuthContext } from '../../../context/authContext';
import { TYPES } from '../../../models/constants';
import { LoginButton, LogoutButton } from '../LogLinks';
import NavHamburger from './NavHamburger';
import NavLinks from './NavLinks';
import UserAvatar from './UserAvatar';
import PATHS from '../../../models/paths';

const NavBar = ({ user }) => {
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext);
    const [open, setOpen] = useState(false);


    useEffect (() => {
        setOpen(false);
    }, [location.pathname]);

    
    // Don't show NavBar when user in BlogPage
    const regex = /\/blogs\/+[a-f\d]{24}$/g;    // eslint-disable-line
    if (location.pathname.match(regex)) {
        return (<></>);
    }

    const handleMenuState = () => setOpen(!open);


    return (
        <nav id='navbar-component-wrapper'>
            <>
                {/* Only visible with small screens */}
                <NavHamburger
                    isOpen={open}
                    handleMenuState={handleMenuState}
                />


                {/* Only visible with larger screens */}
                <NavLinks
                    isAuthenticated={isAuthenticated}
                    isOpen={open}
                    user={user}
                />
            </>

            <div className='right-nav-side'>
                {
                    isAuthenticated ? (
                        <>
                            <UserAvatar user={user} />

                            <div className='link-wrapper nav-username-link'>
                                <NavLink to={PATHS.currentUser}>
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