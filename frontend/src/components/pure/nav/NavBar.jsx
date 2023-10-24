import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { AuthContext } from '../../../context/authContext';
import { TYPES } from '../../../models/constants';
import { LoginButton, LogoutButton } from '../LogLinks';
import NavHamburger from './NavHamburger';
import NavLinks from './NavLinks';
import UserAvatar from './UserAvatar';

const NavBar = ({ user }) => {
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext);
    const [open, setOpen] = useState(false);

    
    // Don't show NavBar when user in BlogPage
    const regex = /[\/blogs\/]+(\d+)$/g;    // eslint-disable-line
    if (location.pathname.match(regex)) {
        return (<></>);
    }

    const handleModalState = () => setOpen(!open);


    return (
        <nav id='navbar-component-wrapper'>
            <>
                {/* Only visible with small screens */}
                <NavHamburger openModal={handleModalState} />


                {/* Only visible with larger screens */}
                <NavLinks
                    isAuthenticated={isAuthenticated}
                    isOpen={open}
                    user={user}
                    handleModalState={handleModalState}
                />
            </>

            <div className='right-nav-side'>
                {
                    isAuthenticated ? (
                        <>
                            <UserAvatar user={user} />

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