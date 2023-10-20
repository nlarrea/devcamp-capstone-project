import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BlogHeader from '../../pure/BlogHeader';
import DataService from '../../../services/data';
import { getApiErrorMsg } from '../../../models/auxFunctions';


const BlogPage = () => {
    const params = useParams();
    const [blogData, setBlogData] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    
    useEffect (() => {
        setIsLoading(true);

        const getBlogData = async () => {
            await DataService.getSingleBlog(blogId).then(response => {
                setBlogData(response.data);
            }).catch(error => {
                setMessage(getApiErrorMsg(error));
            });
        }

        const blogId = params.blogId;
        getBlogData(blogId);
        setIsLoading(false);
    }, [params.blogId]);


    if (isLoading) {
        return (
            <div id='single-blog-page-wrapper' className="page-loader container">
                <BlogHeader blogData={blogData} />

                <main>
                    <FontAwesomeIcon icon='spinner' fixedWidth spin />
                    <span>Loading...</span>
                </main>
            </div>
        )
    }

    
    return (
        <div id='single-blog-page-wrapper' className='container'>
            <BlogHeader blogData={blogData} />

            <main>
                <h1>{blogData?.title}</h1>

                {
                    message && (
                        <p className='api-error-message'>{message}</p>
                    )
                }
                
                <td dangerouslySetInnerHTML={{__html: blogData?.content}} />
            </main>
        </div>
    );
};


export default BlogPage;