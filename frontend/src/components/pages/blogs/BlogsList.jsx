import React, { useState, useEffect } from 'react';

import BlogItem from '../../pure/BlogItem';
import DataService from '../../../services/data';
import { getApiErrorMsg } from '../../../models/auxFunctions';

const BlogsList = () => {
    const [blogList, setBlogList] = useState([]);
    const [message, setMessage] = useState('');
    const [range, setRange] = useState({
        skip: 0,
        limit: 10
    });

    useEffect (() => {
        setMessage('');

        DataService.getAllBlogs({
            skip: range.skip,
            limit: range.limit
        }).then(response => {
            setBlogList([...response.data]);
        }, (error) => {
            setMessage(getApiErrorMsg(error));
        });
    }, [range.limit, range.skip]);


    /* useEffect para un window.addEventListener (y el clean en el return),
    donde cada vez que el usuario llegue a la parte de abajo de la ventana,
    se incrementen en 10 el 'skip' y 'limit' y se vuelva a llamar a la API */


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
                        blogList.map(blog => (
                            <BlogItem key={blog?.id} blog={blog} />
                        ))
                    ) : (
                        <p className='no-blogs-message'>
                            No Blog has been written yet!
                        </p>
                    )
                }
            </main>
        </div>
    );
};


export default BlogsList;