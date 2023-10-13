import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { TYPES } from '../../../models/constants';
import { LogoutButton } from '../../pure/LogLinks';
import BlogItem from '../../pure/BlogItem';

const UserPage = ({ user }) => {
    /* Use the useEffect Hook to call the database and bring minimum the first
    15-20 blogs of this user (infinite scroll to get more blogs) */
    const [blogsList, setBlogsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const getUsersBlogs = useCallback(() => {
        setIsLoading(true);

        axios.get(
            `http://127.0.0.1:8000/blogs/${user.id}`
        ).then(response => {
            const newBlogs = response.data;
            setBlogsList(newBlogs);
        }).catch(error => {
            console.error('Error getting user blogs:', error);
        });

        setIsLoading(false);
    }, [user.id]);

    useEffect (() => {
        getUsersBlogs();
    }, [getUsersBlogs]);


    const handleDeleteBlog = (blogId) => {
        setIsLoading(true);

        axios.delete(
            `http://127.0.0.1:8000/blogs/remove-blog/${blogId}`
        ).then(response => {
            // console.log(response);
            getUsersBlogs();
        }).catch(error => {
            console.error(error);
        });

        setIsLoading(false);
    }
    

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
                        <NavLink className='icon-text-btn' to='/new-blog'>
                            <FontAwesomeIcon icon='paper-plane' />
                            <span>Create new blog</span>
                        </NavLink>

                        <NavLink className='icon-text-btn' to='/users/me/edit'>
                            <FontAwesomeIcon icon='gear' />
                            <span>Configuration</span>
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
                            isLoading ? (
                                <FontAwesomeIcon icon='spinner' fixedWidth spin />
                            ) : (
                                blogsList.length > 0 ? (
                                    blogsList.map(blog => (
                                        <BlogItem
                                            key={blog?.id}
                                            blog={blog}
                                            handleDeleteBlog={handleDeleteBlog}
                                        />
                                    ))
                                ) : (
                                    <p className='no-blogs-message'>
                                        You haven't written any Blog yet!
                                    </p>
                                )
                            )
                        }
                    </div>
                </section>
            </main>
        </div>
    );
};


export default UserPage;