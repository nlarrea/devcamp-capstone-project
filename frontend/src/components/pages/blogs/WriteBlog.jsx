import React, { useContext, useRef, useEffect, useState } from 'react';
import { NavLink, matchRoutes, useLocation, useNavigate, useParams } from 'react-router-dom';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import axios from 'axios';

import useToken from '../../../hooks/useToken';
import { UserContext } from '../../../context/authContext';

const WriteBlog = () => {
    const location = useLocation();
    const { blogId } = useParams();
    const history = useNavigate();
    const { token } = useToken();
    const { user } = useContext(UserContext);

    const blogTitleRef = useRef();
    // const editorRef = useRef();
    const [editorContent, setEditorContent] = useState('');

    const [blogData, setBlogData] = useState({});


    const handleEditorChange = (content) => {
        setEditorContent(content);
    }


    const getBlogData = React.useCallback(() => {
        const currentPath = location.pathname;
        let route;
        const routesMatching = matchRoutes(
            [{ path: '/edit-blog/:blogId' }],
            currentPath
        );

        if (routesMatching === null) {
            route = undefined;
        } else {
            [{ route }] = routesMatching;
        }

        if (route) {
            axios.get(
                `http://127.0.0.1:8000/blogs/single-blog/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }
            ).then(response => {
                // console.log(response.data);

                setBlogData(response.data);
            }).catch(error => {
                console.error(error);
            })
        } else {
            setBlogData({});
        }
    }, [blogId, location, token]);

    useEffect (() => {
        setBlogData({});
        getBlogData();
    }, [getBlogData]);


    const handleSubmit = (event) => {
        event.preventDefault();

        const newBlog = {
            title: blogTitleRef.current.value,
            content: editorContent,
            user_id: user.id,
            image: ''
        };

        if (Object.entries(blogData).length !== 0) {
            // Put the blog -> update it in the database
            const updateBlog = {
                id: blogId,
                ...newBlog
            };

            axios.put(
                `http://127.0.0.1:8000/blogs/edit-blog`,
                updateBlog, {
                    headers: { Authorization: `Bearer ${token}` }
                }
            ).then(response => {
                // console.log(response.data);
            }).catch(error => {
                console.error('Updating error:', error);
            });
        } else {
            // Post the blog -> add it to database
            console.log('token:', token);
            axios.post(
                'http://127.0.0.1:8000/blogs/new-blog',
                newBlog, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            ).then(response => {
                // Check if data is correct
                // console.log(response.data);

                history('/users/me');
            }).catch(error => {
                console.error('Create new blog error:', error);
            });
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
                            defaultValue={blogData.title}
                            required
                            type='text'
                        />
                        <label htmlFor='blog-title' className='input-label'>
                            Blog Title
                        </label>
                    </div>
                </div>

                <SunEditor
                    onChange={handleEditorChange}
                    defaultValue={blogData.content || ''}
                    setContents={blogData.content}
                    placeholder='Write your own story!'
                    setDefaultStyle='font-size: 16px;'
                    setOptions={{
                        buttonList: [
                            [
                                'bold',
                                'underline',
                                'italic',
                                'strike',
                            ],
                            [
                                'list',
                                'align',
                                'table'
                            ],
                            [
                                'fontSize',
                                'formatBlock',
                            ]
                        ]
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