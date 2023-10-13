import React, { useContext, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import useToken from '../../../hooks/useToken';
import { UserContext } from '../../../context/authContext';

const WriteBlog = ({ blogData='' }) => {
    const { token } = useToken();
    const { user } = useContext(UserContext);

    const blogTitleRef = useRef();
    const editorRef = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const newBlog = {
            title: blogTitleRef.current.value,
            content: editorRef.current.getContent(),
            user_id: user.id,
            image: ''
        };

        if (blogData) {
            // Put the blog -> update it in the database
            axios.put()
        } else {
            // Post the blog -> add it to database
            axios.post(
                'http://127.0.0.1:8000/blogs/new-blog',
                newBlog, {
                    headers: { Authorization: `Bearer ${token}` }
                }
            ).then(response => {
                console.log(response.data);
            }).catch(error => {
                console.error('handleSubmitNewBlog for new-blog error\n', error);
            })
        }
    }

    return (
        <div id='write-blog-page-wrapper' className='container'>
            <form onSubmit={handleSubmit}>
                <div className='title-wrapper'>
                    <span>Enter the Blog Title: </span>

                    <div className='input-label-wrapper'>
                        <input
                            ref={blogTitleRef}
                            id='blog-title'
                            className='input-field'
                            placeholder='Blog Title'
                            required
                            type='text'
                        />
                        <label htmlFor='blog-title' className='input-label'>
                            Blog Title
                        </label>
                    </div>
                </div>

                <Editor
                    onInit={ (evt, editor) => editorRef.current = editor }
                    initialValue={blogData}
                    init={{
                        menubar: false,
                        resize: false,
                        placeholder: 'Write your own story!'
                    }}
                />

                <nav>
                    <NavLink to='/users/me' className='cancel-form-submit'>
                        Cancel
                    </NavLink>

                    <button
                        type='submit'
                        className='form-btn'
                    >Submit Blog</button>
                </nav>
            </form>
        </div>
    );
};


export default WriteBlog;