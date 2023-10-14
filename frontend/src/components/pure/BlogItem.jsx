import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BlogItem = ({ blog, handleDeleteBlog }) => {
    const location = useLocation();
    const {
        id,
        title,
        content,
        // user_id, // not being used
        banner_img
    } = blog;
    
    const getBannerImg = () => banner_img ? banner_img.replace('dataimage/jpegbase64', 'data:image/jpeg;base64,') : '';

    return (
        <div className='blog-item-wrapper'>
            <NavLink to={`/blogs/${id}`} className='text-btn'>
                Read Blog
            </NavLink>
            
            <section className='image-wrapper' style={{
                backgroundImage: `url(${getBannerImg()})`
            }} />

            <section className='text-wrapper'>
                <h3>{title}</h3>
                <div className='blogItem-content' dangerouslySetInnerHTML={{__html: content}} />
            
                <nav>
                    {/* <NavLink to={`/blogs/${userId}`} className='icon-btn'>
                        <FontAwesomeIcon icon='user' />
                    </NavLink> */}

                    {
                        location.pathname === '/users/me' &&

                        <>
                            <button className='icon-btn remove-blog-btn' onClick={() => handleDeleteBlog(id)}>
                                <FontAwesomeIcon icon='trash' fixedWidth />
                            </button>

                            <NavLink 
                                to={{ pathname: `/edit-blog/${id}` }}
                                state= {{ from: blog }}
                                className='icon-btn'
                            >
                                <FontAwesomeIcon icon='pencil' fixedWidth />
                            </NavLink>
                        </>
                    }
                </nav>
            </section>
        </div>
    );
};


export default BlogItem;