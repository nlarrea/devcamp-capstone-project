import React from 'react';
import { NavLink } from 'react-router-dom';

import Carousel from '../pure/Carousel';
import { LoginButton, LogoutButton } from '../pure/LogLinks';

const WelcomePage = ({ isAuthenticated, user }) => {
    return (
        <div id='welcome-page' className='container'>
            <header>
                <h1>Welcome</h1>
            </header>

            <nav>
                {
                    isAuthenticated ? (
                        <>
                            <NavLink to={`/users/${user.nickname}`} className='user-link'>
                                <img
                                    src={user?.picture}
                                    alt={user?.nickname}
                                    id='logged-user-nav-img'
                                />
                                <span>{user.nickname}</span>
                            </NavLink>

                            <LogoutButton />
                        </>
                    ) : (
                        <LoginButton type='iconText' />
                    )
                }
            </nav>

            <Carousel />
        </div>
    );
};


export default WelcomePage;