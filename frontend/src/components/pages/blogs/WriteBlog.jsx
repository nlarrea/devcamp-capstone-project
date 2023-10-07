import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const WriteBlog = ({ handleAddBlog }) => {
    const editorRef = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const newBlog = editorRef.current.getContent();

        // Post the blog -> add it to database
        axios.post(
            '',
            newBlog,
            { withCredentials: true }
        ).then(response => {
            handleAddBlog(response.data);
        }).catch(error => {
            console.log('handleSubmitNewBlog for new-blog error\n', error);
        })
    }

    return (
        <div id='write-blog-page-wrapper' className='container'>
            <Editor
                onInit={ (evt, editor) => editorRef.current = editor }
                init={{
                    menubar: false,
                    resize: false
                }}
            />

            <nav>
                <NavLink to='/users/me' className='cancel-form-submit'>
                    Cancel
                </NavLink>

                <button onClick={handleSubmit} className='form-btn'>Submit Blog</button>
            </nav>
        </div>
    );
};


export default WriteBlog;