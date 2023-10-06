import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TYPES } from '../../../models/constants';
import { LogoutButton } from '../../pure/LogLinks';
import BlogItem from '../../pure/BlogItem';

const UserPage = () => {
    /* Use the useEffect Hook to call the database and bring minimum the first
    15-20 blogs of this user (infinite scroll to get more blogs) */
    const user = {};    // remove this
    const blogsList = [];

    return (
        <div id='user-page-wrapper' className='container'>
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
                    <header>
                        <h3>Your Blogs</h3>
                    </header>

                    <div className='blog-items-wrapper'>
                        {
                            blogsList.length > 0 ? (
                                blogsList.map(blog => (
                                    <BlogItem key={blog?.id} blog={blog} />
                                ))
                            ) : (
                                <p className='no-blogs-message'>
                                    You haven't written any Blog yet!
                                </p>
                            )
                        }
                    </div>
                </section>
            </main>
        </div>
    );
};


export default UserPage;