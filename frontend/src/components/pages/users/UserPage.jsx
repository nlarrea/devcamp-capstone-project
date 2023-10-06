import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavBar from '../../pure/NavBar';
import { TYPES } from '../../../models/constants';
import { LogoutButton } from '../../pure/LogLinks';
import BlogItem from '../../pure/BlogItem';

const UserPage = () => {
    /* Use the useEffect Hook to call the database and bring minimum the first
    15-20 blogs of this user (infinite scroll to get more blogs) */
    const user = {};    // remove this
    const blogsList = [{
        id: 1,
        title: 'My blog',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolorum perferendis hic optio in sunt quis cupiditate laborum? Et, harum laboriosam. Harum veritatis iure qui magni assumenda illo possimus nihil laborum sunt. Architecto vitae dolorum, non rerum, similique dolorem debitis impedit, repellat fugiat asperiores quo nulla ratione numquam labore voluptas.',
        // text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum vitae fuga impedit consectetur, nesciunt ullam error, ipsum corporis praesentium velit modi porro voluptas! Eos, quos!',
        image: 'https://mdbootstrap.com/img/new/standard/nature/184.webp'
    }];

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
                    {
                        blogsList.map(blog => (
                            <BlogItem key={blog?.id} blog={blog} />
                        ))
                    }
                </section>
            </main>
        </div>
    );
};


export default UserPage;