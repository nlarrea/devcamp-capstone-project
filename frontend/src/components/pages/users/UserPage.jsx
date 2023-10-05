import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavBar from '../../pure/NavBar';
import { TYPES } from '../../../models/constants';
import { LogoutButton } from '../../pure/LogLinks';

const UserPage = ({ user }) => {
    return (
        <div id='user-page-wrapper' className='container'>
            <NavBar />

            <main>
                <section className='user-options-wrapper'>
                    <header>
                        <div>
                            <h2>{user?.username || 'YourUsername'}</h2>
                            <span>{user?.email || 'your_email@test.com'}</span>
                        </div>

                        <p>Welcome to your own space in the App! Here you can <strong>manage</strong> your own blogs and <strong>edit</strong> your data. <strong>What do you want to do?</strong></p>
                    </header>


                    <nav>
                        <NavLink className='icon-text-btn' to='/blogs/new-blog'>
                            <FontAwesomeIcon icon='paper-plane' />
                            <span>Create new blog</span>
                        </NavLink>

                        <NavLink className='icon-text-btn' to='/users/me/edit'>
                            <FontAwesomeIcon icon='pencil' />
                            <span>Edit profile</span>
                        </NavLink>
                        
                        <LogoutButton type={TYPES.iconText} addClass='icon-text-btn' />
                    </nav>
                </section>

                <section className='user-blogs-wrapper'>
                    {/* create blog items first */}
                </section>
            </main>
        </div>
    );
};


export default UserPage;