import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BlogHeader from '../../pure/blogs/BlogHeader';
import DataService from '../../../services/data';
import { getApiErrorMsg } from '../../../models/auxFunctions';
import PageLoader from '../../pure/PageLoader';


/**
 * Single Blog page. It shows a banner image at the very top of the page, the
 * blog title and the blog content as it is.
 */
const BlogPage = () => {
    // Constants
    const params = useParams();
    // States
    const [blogData, setBlogData] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    
    /**
     * Get the blog data.
     */
    useEffect (() => {
        const getBlogData = async () => {
            await DataService.getSingleBlog(blogId).then(response => {
                setBlogData(response.data);
                setIsLoading(false);
            }).catch(error => {
                setMessage(getApiErrorMsg(error));
                setIsLoading(false);
            });
        }

        const blogId = params.blogId;
        getBlogData(blogId);
    }, [params.blogId]);


    if (isLoading) {
        return <PageLoader text='Loading blog content...' />
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
                
                <div dangerouslySetInnerHTML={{__html: blogData?.content}} />
            </main>
        </div>
    );
};


export default BlogPage;