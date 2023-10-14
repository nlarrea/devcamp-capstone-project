import React, { useContext, useRef, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import FileBase64 from 'react-file-base64';
import axios from 'axios';

import useToken from '../../../hooks/useToken';
import { AuthContext, UserContext } from '../../../context/authContext';
import { UserBlogsContext } from '../../../context/blogsContext';

const WriteBlog = () => {
    const location = useLocation();
    const history = useNavigate();
    const { token } = useToken();
    const { blogId } = useParams();
    const { user, setUser } = useContext(UserContext);
    const { setIsAuthenticated } = useContext(AuthContext);
    const { userBlogs, setUserBlogs } = useContext(UserBlogsContext);

    const blogTitleRef = useRef();
    const [editorContent, setEditorContent] = useState('');
    // const imageRef = useRef();
    const [image, setImage] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [blogData, setBlogData] = useState({});


    const handleEditorChange = (content) => {
        setEditorContent(content);
    }

    useEffect (() => {
        if (location?.state?.from) {
            const blogToEdit = location.state.from;
            setBlogData(blogToEdit);
        }
    }, [location]);


    const handleSubmit = (event) => {
        event.preventDefault();

        const newBlog = {
            title: blogTitleRef.current.value,
            content: editorContent,
            user_id: user.id,
            banner_img: image || ''
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

                setUserBlogs(() => {
                    const restOfBlogs = userBlogs.filter(blog => blog.id !== parseInt(blogId));
                    return [response.data, ...restOfBlogs];
                });
                history('/users/me');
            }).catch(error => {
                console.error('Updating error:', error);

                const errorType = error.response.data.detail.type
                
                if (errorType === 'expired') {
                    setIsAuthenticated(false);
                    setUser({});
                    history('/login');
                }
            });
        } else {
            // Post the blog -> add it to database
            axios.post(
                'http://127.0.0.1:8000/blogs/new-blog',
                newBlog, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            ).then(response => {
                // Check if data is correct
                // console.log('posted blog:', response.data);

                setUserBlogs(prevState => ([
                    response.data, ...prevState
                ]));
                history('/users/me');
            }).catch(error => {
                console.error('Create new blog error:', error);

                const errorType = error.response.data.detail.type
                
                if (errorType === 'expired') {
                    setIsAuthenticated(false);
                    setUser({});
                    history('/login');
                }
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

                <section>
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

                    {
                        Object.entries(blogData).length !== 0 && !editMode ? (
                            <div className='current-blog-banner-image'>
                                <div
                                    className='current-banner-image'
                                    style={{
                                        backgroundImage: `url(${blogData?.banner_img?.replace('dataimage/jpegbase64', 'data:image/jpeg;base64,') || ''})`,
                                        backgroundSize: 'cover',
                                        backgroundColor: 'lightgrey',
                                        backgroundPosition: 'center',
                                        height: '250px',
                                        width: '250px'
                                    }}
                                />

                                <button
                                    type='button'
                                    onClick={() => setEditMode(true)}
                                    className='form-btn edit-btn'
                                >Edit</button>
                            </div>
                        ) : (
                            <div className='current-blog-banner-image'>
                                <FileBase64
                                    type='file'
                                    multiple={ false }
                                    onDone={({base64}) => setImage(base64)}
                                />

                                <button
                                    type='button'
                                    onClick={() => setEditMode(false)}
                                    className='form-btn cancel-btn'
                                >Cancel</button>
                            </div>
                        )
                    }
                </section>

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