import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BlogItem = ({ blog }) => {
    const location = useLocation();
    const {
        id,
        title,
        text,
        // userId,
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
                    {/* <NavLink to={`/blogs/${userId}`} className='icon-btn'>
                        <FontAwesomeIcon icon='user' />
                    </NavLink> */}

                    {
                        location.pathname === '/users/me' &&
                        <NavLink to={`/edit-blog/${id}`} className='icon-btn'>
                            <FontAwesomeIcon icon='pencil' />
                        </NavLink>
                    }
                </nav>
            </section>
        </div>
    );
};


export default BlogItem;