import React, { useState, useEffect } from 'react';

import BlogItem from '../../pure/BlogItem';
import DataService from '../../../services/data';
import { getApiErrorMsg } from '../../../models/auxFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BlogsList = () => {
    const [blogList, setBlogList] = useState([]);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);
    const [scrollEnd, setScrollEnd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const getBlogsData = async () => {
        await DataService.getAllBlogs(page).then(response => {
            setBlogList(prev => prev.concat(response.data));
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

        setIsLoading(true);
        setPage(prev => prev + 1);
        setScrollEnd(true);
      };
    
    
    /**
     * Scroll event listener.
     */
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { capture: true });
        return () => window.removeEventListener('scroll', handleScroll, { capture: true });

    // eslint-disable-next-line
    }, []);


    /**
     * Call the API when the page is opened.
     */
    useEffect (() => {
        setIsLoading(true);
        setMessage('');

        getBlogsData();
    // eslint-disable-next-line
    }, []);


    /**
     * Call the API again when the bottom of the page is reached.
     */
    useEffect (() => {
        if (scrollEnd) {
            getBlogsData();
        }
    // eslint-disable-next-line
    }, [scrollEnd]);


    return (
        <div id="blogs-list-page-wrapper" className='container'>
            {
                message && (
                    <p className='api-error-message'>{message}</p>
                )
            }
            <main className='blog-items-wrapper'>
                {
                    blogList.length > 0 ? (
                        blogList.map((blog, index) => (
                            <BlogItem
                                key={`${blog?.id}${blog?.title}${index}`}
                                blog={blog}
                            />
                        ))
                    ) : (
                        <p className='no-blogs-message'>
                            No Blog has been written yet!
                        </p>
                    )
                }
            </main>
            {
                isLoading && (
                    <div className='content-loader'>
                        <FontAwesomeIcon icon='spinner' fixedWidth spin />
                        <span>Loading blogs...</span>
                    </div>
                )
            }
        </div>
    );
};


export default BlogsList;