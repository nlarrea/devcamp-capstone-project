import React, { useState, useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import avatar from '../../../static/images/avatars/user_avatar.svg';
import { UserContext } from '../../../context/authContext';
import useToken from '../../../hooks/useToken';
import {
    checkOldAndNewPasswords,
    checkPasswords,
    checkUsername,
    passCharConditions
} from '../../../models/auxFunctions';
import PasswordCharTest from '../../pure/PasswordCharTest';
import FileBase64 from '../../pure/FileBase64';

const UserEditPage = () => {
    // Context & global variable's state
    const { user, setUser } = useContext(UserContext);
    const { token, saveToken } = useToken();
    const [isLoading, setIsLoading] = useState(false);
    const [editImgMode, setEditImgMode] = useState(false);

    const originalImg = user?.image || null;
    const [image, setImage] = useState(originalImg ? originalImg : null);

    const [viewOldPass, setViewOldPass] = useState(false);
    const [viewPass1, setViewPass1] = useState(false);
    const [viewPass2, setViewPass2] = useState(false);

    // Refs to inputs
    const usernameRef = useRef();
    const emailRef = useRef();
    const oldPassRef = useRef();
    const pass1Ref = useRef();
    const pass2Ref = useRef();

    // State to errors
    const [userError, setUserError] = useState(false);
    const [userErrorMsg, setUserErrorMsg] = useState('');

    const [oldPassError, setOldPassError] = useState(false);
    const [oldPassErrorMsg, setOldPassErrorMsg] = useState('');
    const [pass1Error, setPass1Error] = useState(false);
    const [pass1ErrorMsg, setPass1ErrorMsg] = useState('');
    const [pass2Error, setPass2Error] = useState(false);
    const [pass2ErrorMsg, setPass2ErrorMsg] = useState('');
    const [charConditions, setCharConditions] = useState();


    const handleRemoveImg = () => {
        setEditImgMode(true);
        setImage(null);
    }


    const handleCancelImg = () => {
        setEditImgMode(false);
        setImage(originalImg);
    }


    const updateUser = async ( newUserData ) => {
        return await axios.put(
            'http://127.0.0.1:8000/users/check-user-exists',
            newUserData, {
                headers: { Authorization: `Bearer ${token}` }
            }
        ).then(response => {
            saveToken(response.data.access_token);
            return response.data.access_token;
        }).catch(error => {
            console.error('Error updating user data:', error);
        });
    };

    /* const updateToken = async (newUserData) => {
        const newLoginCredentials = {
            email: newUserData.email,
            password: newUserData.new_password
        };

        return await axios.post(
            'http://127.0.0.1:8000/users/login',
            newLoginCredentials
        ).then(response => {
            saveToken(response.data.access_token);
            return response.data.access_token
        }).catch(error => {
            console.error('Error login user with new credentials:', error);
        });
    }; */

    const getUserNewData = async (token) => {
        await axios.get(
            'http://127.0.0.1:8000/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            }
        ).then(response => {
            setUser(response.data);
        }).catch(error => {
            console.error('Error getting user\'s new data:', error);
        });
    };


    // When changes are made, send those to DB
    const handleSubmit = async (event) => {
        setIsLoading(true);
        event.preventDefault();

        if (userError || pass1Error || pass2Error || oldPassError) {
            return;
        }

        const newUserData = {
            username: usernameRef.current.value || user.username,
            email: emailRef.current.value || user.email,
            old_password: oldPassRef.current.value,
            new_password: pass1Ref.current.value || '',
            image: image || ''
        }

        console.log('newUserData:', newUserData);

        // Check if new data doesn't already exist
        const validCredentials = await updateUser(newUserData);
        
        if (validCredentials) {
            localStorage.removeItem('token');
            // const createdToken = await updateToken(newUserData);
            await getUserNewData(validCredentials);
        }

        setIsLoading(false);
    }


    const handlePassChange = () => {
        const pass1 = pass1Ref?.current?.value;
        const pass2 = pass2Ref?.current?.value;

        if (pass1 || pass2) {
            checkPasswords({
                pass1: pass1Ref.current.value,
                pass2: pass2Ref.current.value,
                isError1: setPass1Error,
                errorMsg1: setPass1ErrorMsg,
                isError2: setPass2Error,
                errorMsg2: setPass2ErrorMsg
            });
    
            // Check if password has at least one of the char types
            const newConditions = passCharConditions({
                password: pass1Ref.current.value,
                isError: setPass1Error,
                errorMessage: setPass1ErrorMsg
            });
            setCharConditions(newConditions);
        } else {
            setPass1Error(false);
            setPass1ErrorMsg('');
            setPass2Error(false);
            setPass2ErrorMsg('');
        }
    }


    const handleOldPassChange = () => {
        const oldPass = oldPassRef?.current?.value;
        const newPass = pass1Ref?.current?.value;

        if (newPass) {
            checkOldAndNewPasswords({
                oldPass: oldPass,
                newPass: newPass,
                isOldError: setOldPassError,
                oldErrorMsg: setOldPassErrorMsg,
                isNewError: setPass1Error,
                newErrorMsg: setPass1ErrorMsg
            });
    
            passCharConditions({
                password: oldPass,
                isError: setOldPassError,
                errorMessage: setOldPassErrorMsg
            });
        } else {
            setPass1Error(false);
            setPass1ErrorMsg('');
        }
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
                            spellCheck={false}
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
                            spellCheck={false}
                            required
                        />
                        <label
                            htmlFor="email-input"
                            className='input-label'
                        >Email</label>
                        <FontAwesomeIcon icon='at' className='input-icon' />
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            ref={oldPassRef}
                            onChange={handleOldPassChange}
                            type={viewOldPass ? 'text' : "password"}
                            className={`input-field ${oldPassError ? 'input-error' : ''}`}
                            id='original-password'
                            placeholder='1234ABcd_'
                            spellCheck={false}
                            required
                            autoFocus={true}
                        />
                        <label
                            htmlFor="original-password"
                            className='input-label'
                        >Old Password</label>
                        {
                            viewOldPass ? (
                                <FontAwesomeIcon
                                    onClick={() => setViewOldPass(!viewOldPass)}
                                    icon='lock-open'
                                    className='input-icon icon-btn'
                                    fixedWidth
                                />
                            ) : (
                                <FontAwesomeIcon
                                    onClick={() => setViewOldPass(!viewOldPass)}
                                    icon='lock'
                                    className='input-icon icon-btn'
                                    fixedWidth
                                />
                            )
                        }
                        <span className='error-message'>{oldPassErrorMsg || 'Required'}</span>
                    </div>

                    <div className='input-label-wrapper' id='password-wrapper'>
                        <input
                            ref={pass1Ref}
                            onChange={handlePassChange}
                            type={viewPass1 ? 'text' : "password"}
                            className={`input-field ${pass1Error ? 'input-error' : ''}`}
                            id='password-1'
                            placeholder='_abCD1234'
                            spellCheck={false}
                            required
                        />
                        <label
                            htmlFor="password-1"
                            className='input-label'
                        >New Password</label>
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
                            placeholder='_abCD1234'
                            spellCheck={false}
                            required
                        />
                        <label
                            htmlFor="password-2"
                            className='input-label'
                        >Confirm New Password</label>
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

                {/* user image */}
                <section className='user-img-section'>
                    {
                        editImgMode ? (
                            <>
                                <FileBase64
                                    type='file'
                                    multiple={ false }
                                    onDone={({base64}) => setImage(base64)}
                                />

                                <button
                                    onClick={handleCancelImg}
                                    className='form-btn cancel-btn'
                                >Cancel</button>
                            </>
                        ) : (
                            <>
                                <div className="current-user-image-wrapper">
                                    <div
                                        className='current-user-image'
                                        style={{
                                            backgroundImage: `url(${image?.replace('dataimage/jpegbase64', 'data:image/jpeg;base64,') || originalImg || avatar})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handleRemoveImg}
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
                    type='submit'
                    onClick={handleSubmit}
                    className='form-btn'
                >
                    {
                        isLoading ? (
                            <FontAwesomeIcon icon='spinner' fixedWidth spin />
                        ) : (
                            'Confirm Changes'
                        )
                    }
                </button>
            </nav>
        </div>
    );
};


export default UserEditPage;
