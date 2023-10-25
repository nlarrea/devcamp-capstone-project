import { useState, useEffect } from 'react';

import BlogItem from '../../pure/blogs/BlogItem';
import DataService from '../../../services/data';
import { getApiErrorMsg } from '../../../models/auxFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BlogsList = () => {
    // States
    const [blogList, setBlogList] = useState([]);
    const [totalOfBlogs, setTotalOfBlogs] = useState(0);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);
    const [scrollEnd, setScrollEnd] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    /**
     * Uses DataService to call the API and fetch the blogs and the total of
     * blogs from it.
     */
    const getBlogsData = async () => {
        await DataService.getAllBlogs(page).then(response => {
            setTotalOfBlogs(response.data.total)
            setBlogList(prev => prev.concat(response.data.blogs));
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
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { capture: true });
        return () => window.removeEventListener('scroll', handleScroll, { capture: true });

    // eslint-disable-next-line
    }, [totalOfBlogs, page, isLoading]);


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
                        !isLoading &&
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