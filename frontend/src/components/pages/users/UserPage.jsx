import { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DataService from '../../../services/data';
import { UserContext } from '../../../context/authContext';
import { UserBlogsContext } from '../../../context/blogsContext';
import { LOADER_TYPES, TYPES } from '../../../models/constants';
import BlogItem from '../../pure/blogs/BlogItem';
import { LogoutButton } from '../../pure/LogLinks';
import { getApiErrorMsg } from '../../../models/auxFunctions';
import Loader from '../../pure/Loader';
import PATHS from '../../../models/paths';


const UserPage = () => {
    // Contexts
    const { user } = useContext(UserContext);
    const { userBlogs, setUserBlogs } = useContext(UserBlogsContext);
    // States
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [scrollEnd, setScrollEnd] = useState(false);
    const [totalOfBlogs, setTotalOfBlogs] = useState(0);


    /**
     * Uses DataService to call the API and fetch the user's blogs and the
     * total of blogs from it.
     */
    const getBlogsData = async () => {
        await DataService.getUserBlogs(user.id, page).then(response => {
            setTotalOfBlogs(response.data.total);
            setUserBlogs(prev => prev.concat(response.data.blogs));
            setIsLoading(false);
        }, (error) => {
            setMessage(getApiErrorMsg(error));
            setIsLoading(false);
        });

        setScrollEnd(false);
    }


    /**
     * If the user gets to the end of the page (to the bottom), it updates the
     * states to call the API once again.
     */
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
            document.documentElement.offsetHeight || isLoading
        ) {
            return;
        }

        if ((totalOfBlogs - (10 * page)) / 10 > 0) {
            setIsLoading(true);
            setScrollEnd(true);
            setPage(prev => prev + 1);
        }
    };


    /**
     * Scroll event listener.
     */
    useEffect (() => {
        window.addEventListener('scroll', handleScroll, { capture: true });
        return () => window.removeEventListener('scroll', handleScroll, { capture: true });
    
    // eslint-disable-next-line
    }, [totalOfBlogs, page, isLoading]);


    /**
     * Fetch the data when the page is first opened.
     */
    useEffect (() => {
        setIsLoading(true);
        setMessage('');
        setUserBlogs([])

        getBlogsData();
        // eslint-disable-next-line
    }, []);


    /**
     * Fetch data again when the bottom of the page is reached.
     */
    useEffect (() => {
        if (scrollEnd) {
            getBlogsData();
        }
    // eslint-disable-next-line
    }, [scrollEnd]);


    /**
     * Deletes the obtained blog from database and updates the current blog
     * list.
     * @param {Number} blogId The ID of the blog to delete.
     */
    const handleDeleteBlog = async (blogId) => {
        setIsLoading(true);

        await DataService.deleteBlog(blogId).then(response => {
            const currentBlogs = userBlogs.filter(blog => blog.id !== response.data);
            setUserBlogs([...currentBlogs]);
        }).catch(error => {
            setMessage(getApiErrorMsg(error));
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
                        <NavLink className='icon-text-btn' to={PATHS.newBlog}>
                            <FontAwesomeIcon icon='paper-plane' />
                            <span>Create new blog</span>
                        </NavLink>

                        <NavLink className='icon-text-btn' to={PATHS.editUser}>
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
                            message && (
                                <p className='api-error-message'>{message}</p>
                            )
                        }
                        {
                            userBlogs.length > 0 ? (
                                userBlogs.map((blog, index) => (
                                    <BlogItem
                                        key={`${blog.id}${index}`}
                                        blog={blog}
                                        handleDeleteBlog={handleDeleteBlog}
                                    />
                                ))
                            ) : (
                                !isLoading && !message &&
                                <p className='no-blogs-message'>
                                    You haven't written any Blog yet!
                                </p>
                            )
                        }
                        {
                            isLoading && (
                                <Loader
                                    text='Loading your Blogs...'
                                    type={LOADER_TYPES.content}
                                />
                            )
                        }
                    </div>
                </section>
            </main>
        </div>
    );
};


export default UserPage;