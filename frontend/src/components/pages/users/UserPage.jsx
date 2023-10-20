import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DataService from '../../../services/data';
import { AuthContext, UserContext } from '../../../context/authContext';
import { UserBlogsContext } from '../../../context/blogsContext';
import { TYPES } from '../../../models/constants';
import BlogItem from '../../pure/BlogItem';
import { LogoutButton } from '../../pure/LogLinks';
import { getApiErrorMsg } from '../../../models/auxFunctions';


const UserPage = () => {
    /* Use the useEffect Hook to call the database and bring minimum the first
    15-20 blogs of this user (infinite scroll to get more blogs) */
    const history = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const { setIsAuthenticated } = useContext(AuthContext);
    const { userBlogs, setUserBlogs } = useContext(UserBlogsContext);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect (() => {
        setIsLoading(true);
        setMessage('');

        DataService.getUserBlogs(user.id).then(response => {
            setUserBlogs([...response.data]);
        }).catch(error => {
            setMessage(getApiErrorMsg(error));
        });

        setIsLoading(false);
        // eslint-disable-next-line
    }, []);


    const handleDeleteBlog = async (blogId) => {
        setIsLoading(true);

        await DataService.deleteBlog(blogId).then(response => {
            const currentBlogs = userBlogs.filter(blog => blog.id !== response.data);
            setUserBlogs([...currentBlogs]);
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                setUser({});
                setIsAuthenticated(false);
                setUserBlogs([]);
                history('/login');
            } else {
                setMessage(getApiErrorMsg(error));
            }
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
                            userBlogs.length > 0 ? (
                                userBlogs.map(blog => (
                                    <BlogItem
                                        key={blog.id}
                                        blog={blog}
                                        handleDeleteBlog={handleDeleteBlog}
                                    />
                                ))
                            ) : (
                                message ? (
                                    <p className='no-blogs-message'>{message}</p>
                                ) : (
                                    isLoading ? (
                                        <div>
                                            <FontAwesomeIcon icon='spinner' fixedWidth spin />
                                        </div>
                                    ) : (
                                        <p className='no-blogs-message'>
                                            You haven't written any Blog yet!
                                        </p>
                                    )
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