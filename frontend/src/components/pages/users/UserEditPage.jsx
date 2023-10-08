import React, { useState, useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropzoneComponent } from 'react-dropzone-component';
import '../../../../node_modules/react-dropzone-component/styles/filepicker.css';
import '../../../../node_modules/dropzone/dist/min/dropzone.min.css';

import { UserContext } from '../../../context/authContext';
import { checkPasswords, checkUsername, passCharConditions } from '../../../models/auxFunctions';
import avatar from '../../../static/images/avatars/male_avatar.svg';
import PasswordCharTest from '../../pure/PasswordCharTest';

const UserEditPage = () => {
    // Dropzone configuration
    const componentConfig = {
        iconFiletypes: ['.jpg', '.png'],
        showFiletypeIcon: true,
        postUrl: 'https://httpbin.org/post'
    }

    const djsConfig = {
        addRemoveLinks: true,
        maxFiles: 1
    }

    // Context & global variable's state
    const user = useContext(UserContext);
    const [editImgMode, setEditImgMode] = useState(false);

    const [username, setUsername] = useState(user?.username);
    const [email, setEmail] = useState(user?.email);
    const [password, setPassword] = useState(user?.password);
    const [image, setImage] = useState(user?.image);

    const [viewPass1, setViewPass1] = useState(false);
    const [viewPass2, setViewPass2] = useState(false);

    // Refs to inputs
    const usernameRef = useRef();
    const emailRef = useRef();
    const pass1Ref = useRef();
    const pass2Ref = useRef();

    // State to errors
    const [userError, setUserError] = useState(false);
    const [userErrorMsg, setUserErrorMsg] = useState('');

    const [pass1Error, setPass1Error] = useState(false);
    const [pass1ErrorMsg, setPass1ErrorMsg] = useState('');
    const [pass2Error, setPass2Error] = useState(false);
    const [pass2ErrorMsg, setPass2ErrorMsg] = useState('');
    const [charConditions, setCharConditions] = useState();


    // Create a form because we are passing images too
    const buildForm = () => {
        let formData = new FormData();

        formData.append('user[username]', username);
        formData.append('user[email]', email);
        formData.append('user[password]', password);

        if (image) {
            formData.append('user[image]', image);
        }
        
        return formData;
    }


    // When changes are made, send those to DB
    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if data is correct
        

        /* Check if new username doesn't exist in DB
            * Check if current username !== new username
            * Check if new username doesn't exist in DB
        */
        if (usernameRef.current.value !== username) {
            setUsername(usernameRef.current.value);
        }

        /* Check if new email doesn't exist in DB
            * Check if current email !== new email
            * Check if new email doesn't exist in DB
        */
        if (emailRef.current.value !== email) {
            setEmail(emailRef.current.value);
        }

        buildForm();

    }


    const handlePassChange = () => {
        checkPasswords(
            pass1Ref.current.value,
            pass2Ref.current.value,
            setPass1Error,
            setPass1ErrorMsg,
            setPass2Error,
            setPass2ErrorMsg
        );

        // Check if password has at least one of the char types
        const newConditions = passCharConditions(
            pass1Ref.current.value,
            setPass1Error,
            setPass1ErrorMsg
        );
        setCharConditions(newConditions);
    }


    return (
        <div id='edit-user-data-page-wrapper' className='container'>
            <main>
                <section>
                    <div className='input-label-wrapper'>
                        <input
                            ref={usernameRef}
                            onChange={() => checkUsername(
                                usernameRef.current.value,
                                setUserError,
                                setUserErrorMsg
                            )}
                            type='text'
                            className={`input-field ${userError ? 'input-error' : ''}`}
                            id='username-input'
                            placeholder='YourUsername'
                            defaultValue={user.username}
                            required
                        />
                        <label
                            htmlFor="username-input"
                            className='input-label'
                        >Username</label>
                        <FontAwesomeIcon icon='user' className='input-icon' />
                        {userErrorMsg && <span className='error-message'>{userErrorMsg}</span>}
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            ref={emailRef}
                            type='email'
                            className='input-field'
                            id='email-input'
                            placeholder='your_email@example.com'
                            defaultValue={user.email}
                            required
                        />
                        <label
                            htmlFor="email-input"
                            className='input-label'
                        >Email</label>
                        <FontAwesomeIcon icon='at' className='input-icon' />
                    </div>

                    <div className='input-label-wrapper' id='password-wrapper'>
                        <input
                            ref={pass1Ref}
                            onChange={handlePassChange}
                            type={viewPass1 ? 'text' : "password"}
                            className={`input-field ${pass1Error ? 'input-error' : ''}`}
                            id='password-1'
                            placeholder='abCD1234'
                            defaultValue={user.password || ''}
                            required
                        />
                        <label
                            htmlFor="password-1"
                            className='input-label'
                        >Password</label>
                        {
                            viewPass1 ? (
                                <FontAwesomeIcon
                                    onClick={() => setViewPass1(!viewPass1)}
                                    icon='lock-open'
                                    className='input-icon icon-btn'
                                    fixedWidth
                                />
                            ) : (
                                <FontAwesomeIcon
                                    onClick={() => setViewPass1(!viewPass1)}
                                    icon='lock'
                                    className='input-icon icon-btn'
                                    fixedWidth
                                />
                            )
                        }
                        {pass1ErrorMsg && <span className='error-message'>{pass1ErrorMsg}</span>}
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            ref={pass2Ref}
                            onChange={handlePassChange}
                            type={viewPass2 ? 'text' : "password"}
                            className={`input-field ${pass2Error ? 'input-error' : ''}`}
                            id='password-2'
                            placeholder='abCD1234'
                            defaultValue={user.password || ''}
                            required
                        />
                        <label
                            htmlFor="password-2"
                            className='input-label'
                        >Confirm Password</label>
                        {
                            viewPass2 ? (
                                <FontAwesomeIcon
                                    onClick={() => setViewPass2(!viewPass2)}
                                    icon='lock-open'
                                    className='input-icon icon-btn'
                                    fixedWidth
                                />
                            ) : (
                                <FontAwesomeIcon
                                    onClick={() => setViewPass2(!viewPass2)}
                                    icon='lock'
                                    className='input-icon icon-btn'
                                    fixedWidth
                                />
                            )
                        }
                        {pass2ErrorMsg && <span className='error-message'>{pass2ErrorMsg}</span>}
                    </div>

                    <PasswordCharTest
                        hasUpper={charConditions?.hasUpper || false}
                        hasLower={charConditions?.hasLower || false}
                        hasNumber={charConditions?.hasNumber || false}
                        hasSpecial={charConditions?.hasSpecial || false}
                    />
                </section>

                {/* DROPZONE -> user image */}
                <section className='user-img-section'>
                    {/* 
                        Poner un div con la img actual del user y un button que
                        permita modificar la img. Si se pulsa el botón, en vez
                        de mostrarse la img, se verá el Dropzone para poder
                        subir una nueva.
                        Añadir también un "Cancel" para volver a la imagen.

                        editImgMode -> useState
                        editImgMode ? (Dropzone) : (div con img)
                    */}
                    {
                        editImgMode ? (
                            <>
                                <DropzoneComponent
                                    config={componentConfig}
                                    djsConfig={djsConfig}
                                >
                                    <div className='dz-message'>User Image</div>
                                </DropzoneComponent>

                                <button
                                    onClick={() => setEditImgMode(false)}
                                    className='form-btn cancel-btn'
                                >Cancel</button>
                            </>
                        ) : (
                            <>
                                <div className="current-user-image-wrapper">
                                    <div
                                        className='current-user-image'
                                        style={{
                                            backgroundImage: `url(${user?.image || avatar})`
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={() => setEditImgMode(true)}
                                    className='form-btn edit-btn'
                                >Edit</button>
                            </>
                        )
                    }
                </section>
            </main>

            <nav>
                <NavLink to='/users/me'>Cancel</NavLink>

                <button
                    onClick={handleSubmit}
                    className='form-btn'
                >
                    Confirm Changes
                </button>
            </nav>
        </div>
    );
};


export default UserEditPage;
