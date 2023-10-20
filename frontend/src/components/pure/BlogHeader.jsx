import React from 'react';


const BlogHeader = ({ blog }) => {
    return (
        <header className='skewed-header-wrapper'>
            <div
                className='skewed-header'
                style={blog.banner_image && ({
                    backgroundImage: `url(${blog.banner_image})`
                })}
                >
                <h1>
                    {blog.title}
                </h1>
            </div>
        </header>
    );
};


export default BlogHeader;