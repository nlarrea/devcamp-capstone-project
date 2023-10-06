import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BlogItem = ({ blog }) => {
    const {
        id,
        title,
        text,
        image
    } = blog;

    return (
        <div className='blog-item-wrapper'>
            <NavLink to={`/blogs/${id}`} className='text-btn'>
                Read Blog
            </NavLink>
            
            <section className='image-wrapper' style={{backgroundImage: `url(${image})`}} />

            <section className='text-wrapper'>
                <h3>{title}</h3>
                <p>{text}</p>
            
                <nav>
                    <NavLink to={`/blogs/edit-blog/${id}`} className='icon-btn'>
                        <FontAwesomeIcon icon='pencil' />
                    </NavLink>
                </nav>
            </section>
        </div>
    );
};


export default BlogItem;