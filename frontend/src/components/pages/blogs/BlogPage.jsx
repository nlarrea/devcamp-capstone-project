import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogPage = () => {
    const [blogData, setBlogData] = useState('');

    const getBlogData = () => {
        axios.get(

        ).then(response => {
            const obtainedData = response.data;
            setBlogData(obtainedData);
        }).catch(error => {
            console.log('BlogPage fetch data error', error);
        })
    }

    useEffect (() => {
        getBlogData();
    }, []);

    
    return (
        <div id='single-blog-page-wrapper' className='container'>
            <td dangerouslySetInnerHTML={{__html: blogData}} />
        </div>
    );
};


export default BlogPage;