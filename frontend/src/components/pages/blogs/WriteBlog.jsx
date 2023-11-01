import { useContext, useRef, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import DataService from '../../../services/data';
import { AuthContext, UserContext } from '../../../context/authContext';
import { UserBlogsContext } from '../../../context/blogsContext';
import FileBase64 from '../../pure/FileBase64';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PATHS from '../../../models/paths';

const WriteBlog = () => {
    // Constants
    const location = useLocation();
    const history = useNavigate();
    const { blogId } = useParams();

    // Contexts
    const { user, setUser } = useContext(UserContext);
    const { setIsAuthenticated } = useContext(AuthContext);
    const { userBlogs, setUserBlogs } = useContext(UserBlogsContext);
    
    // States and all the necessaries to get data from written blog
    const [isLoading, setIsLoading] = useState(false);

    const blogTitleRef = useRef();
    const [editorContent, setEditorContent] = useState('');

    const originalImg = location?.state?.from?.banner_img || '';
    const [image, setImage] = useState(originalImg ? originalImg : null);
    const [editMode, setEditMode] = useState(false);

    // If edit mode, this will store the data from the blog to edit
    const [blogData, setBlogData] = useState({});


    /**
     * Set the editor content to the state
     * @param {string} content Suneditor's content
     */
    const handleEditorChange = (content) => {
        setEditorContent(content);
    }


    /**
     * Removes the current image from the state, and allows user to enter a new
     * image.
     */
    const handleRemoveImg = () => {
        setEditMode(true);
        setImage(null);
    }


    /**
     * Resets the image to the original value and sets to false the edit mode.
     */
    const handleCancelImg = () => {
        setEditMode(false);
        setImage(originalImg);
    }


    /**
     * If the current path is the edit one, gets the blog data and stores it.
     */
    useEffect (() => {
        if (location?.state?.from) {
            const blogToEdit = location.state.from;
            setBlogData(blogToEdit);
        } else {
            setBlogData({})
        }
    }, [location]);


    /**
     * Takes in count if the edit mode is on or not to send a POST or a PUT
     * request to the API.
     * @param {*} event The submit event from the form.
     */
    const handleSubmit = (event) => {
        setIsLoading(true);
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

            DataService.updateBlog(updateBlog).then(response => {
                setUserBlogs(() => {
                    const restOfBlogs = userBlogs.filter(blog => blog.id !== parseInt(blogId));
                    return [response?.data, ...restOfBlogs];
                });
                history(PATHS.currentUser);
            }).catch(error => {
                const errorType = error.response?.data?.detail?.type
                
                if (errorType === 'expired') {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUser({});
                    setUserBlogs({})
                    history(PATHS.login);
                }
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            // Post the blog -> add it to database
            DataService.createBlog(newBlog).then(response => {
                setUserBlogs(prevState => ([
                    response.data, ...prevState
                ]));
                history(PATHS.currentUser);
            }).catch(error => {
                const errorType = error.response?.data?.detail?.type
                
                if (errorType === 'expired') {
                    setIsAuthenticated(false);
                    setUser({});
                    history(PATHS.login);
                }
            }).finally(() => {
                setIsLoading(false);
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
                            autoFocus={true}
                        />
                        <label htmlFor='blog-title' className='input-label'>
                            Blog Title
                        </label>
                    </div>
                </div>

                <section>
                    <SunEditor
                        onChange={handleEditorChange}
                        setContents={blogData.content || ''}
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
                        Object.entries(blogData).length !== 0 ? (
                            /* EDIT BLOG MODE */
                            !editMode ? (
                                /* SHOW ORIGINAL IMAGE */
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
                                        onClick={handleRemoveImg}
                                        className='form-btn edit-btn'
                                    >Remove</button>
                                </div>
                            ) : (
                                /* ADD ANOTHER IMAGE */
                                <div className='current-blog-banner-image'>
                                    <FileBase64
                                        inputId='banner-image'
                                        multiple={false}
                                        onDone={({base64}) => setImage(base64)}
                                    />

                                    <button
                                        type='button'
                                        onClick={handleCancelImg}
                                        className='form-btn cancel-btn'
                                    >Cancel</button>
                                </div>
                            )
                        ) : (
                            /* WRITING A NEW BLOG MODE */
                            <div className='current-blog-banner-image'>
                                <FileBase64
                                    inputId='banner-image'
                                    multiple={false}
                                    onDone={({base64}) => setImage(base64)}
                                />
                            </div>
                        )
                    }
                </section>

                <nav>
                    <NavLink to={PATHS.currentUser} className='cancel-form-submit'>
                        Cancel
                    </NavLink>

                    <button
                        type='submit'
                        className='form-btn'
                    >
                        {
                            isLoading ? (
                                <FontAwesomeIcon icon='spinner' fixedWidth spin />
                            ) : (
                                'Submit Blog'
                            )
                        }
                    </button>
                </nav>
            </form>
        </div>
    );
};


export default WriteBlog;