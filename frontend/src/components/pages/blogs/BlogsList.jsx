import React from 'react';

import BlogItem from '../../pure/BlogItem';

const BlogsList = () => {
    const blogs = [];


    return (
        <div id="blogs-list-page-wrapper" className='container'>
            <main className='blog-items-wrapper'>
                {
                    blogs.length > 0 ? (
                        blogs.map(blog => (
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