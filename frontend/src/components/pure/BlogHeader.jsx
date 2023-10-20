import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const BlogHeader = ({ blogData }) => {
    const history = useNavigate();


    return (
        <header className='skewed-header-wrapper'>
            <div
                className='skewed-header-bg'
                style={{
                    backgroundImage: `url(${blogData?.banner_img?.replace('dataimage/jpegbase64', 'data:image/jpeg;base64,')})`
                }}
            />

            <nav>
                <button
                    type='button'
                    className='go-back-button'
                    onClick={() => history(-1)}
                >
                    <FontAwesomeIcon icon='chevron-left' fixedWidth />
                    Go Back
                </button>

                <div className='blog-link-wrapper'>
                    <NavLink to='/'>Home</NavLink>
                </div>
            </nav>
        </header>
    );
};


export default BlogHeader;