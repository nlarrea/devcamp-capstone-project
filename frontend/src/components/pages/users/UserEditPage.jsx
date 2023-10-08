import React, { useState, useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropzoneComponent } from 'react-dropzone-component';
import '../../../../node_modules/react-dropzone-component/styles/filepicker.css';
import '../../../../node_modules/dropzone/dist/min/dropzone.min.css';

import { UserContext } from '../../../context/authContext';
import { checkPasswords, checkUsername } from '../../../models/auxFunctions';
import avatar from '../../../static/images/avatars/male_avatar.svg';

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

    // Refs to inputs
    const usernameRef = useRef();
    const emailRef = useRef();
    const pass1Ref = useRef();
    const pass2Ref = useRef();

    // State to errors
    const [userError, setUserError] = useState(false);
    const [userErrorMsg, setUserErrorMsg] = useState('');

    const [passError, setPassError] = useState(false);
    const [passErrorMsg, setPassErrorMsg] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if data is correct
        const correctUser = checkUsername(
            usernameRef.current.value,
            setUserError,
            setUserErrorMsg
        )

        const correctPassword = checkPasswords(
            pass1Ref.current.value,
            pass2Ref.current.value,
            setPassError,
            setPassErrorMsg
        );

        /* Check if new username doesn't exist in DB
            * Check if current username !== new username
            * Check if new username doesn't exist in DB
        */

        /* Check if new email doesn't exist in DB
            * Check if current email !== new email
            * Check if new email doesn't exist in DB
        */
    }


    return (
        <div id='edit-user-data-page-wrapper' className='container'>
            <main>
                <section>
                    <div className='input-label-wrapper'>
                        <input
                            ref={usernameRef}
                            type='text'
                            className='input-field'
                            id='username-input'
                            placeholder='YourUsername'
                            defaultValue={user.username}
                        />
                        <label
                            htmlFor="username-input"
                            className='input-label'
                        >Username</label>
                        <FontAwesomeIcon icon='user' className='input-icon' />
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            ref={emailRef}
                            type='email'
                            className='input-field'
                            id='email-input'
                            placeholder='your_email@example.com'
                            defaultValue={user.email}
                        />
                        <label
                            htmlFor="email-input"
                            className='input-label'
                        >Email</label>
                        <FontAwesomeIcon icon='at' className='input-icon' />
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            ref={pass1Ref}
                            type='password'
                            className='input-field'
                            id='password-1'
                            placeholder='abCD1234'
                            defaultValue={user.password}
                        />
                        <label
                            htmlFor="password-1"
                            className='input-label'
                        >Password</label>
                        <FontAwesomeIcon icon='lock' className='input-icon' />
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            ref={pass2Ref}
                            type='password'
                            className='input-field'
                            id='password-2'
                            placeholder='abCD1234'
                            defaultValue={user.password}
                        />
                        <label
                            htmlFor="password-2"
                            className='input-label'
                        >Confirm Password</label>
                        <FontAwesomeIcon icon='lock' className='input-icon' />
                    </div>
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
