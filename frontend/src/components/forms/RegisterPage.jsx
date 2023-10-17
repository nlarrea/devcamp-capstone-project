import React, { useContext, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { AuthContext, UserContext } from '../../context/authContext';
import registerImg from '../../static/images/forms/register.svg';
import { checkUsername, checkPasswords, passCharConditions } from '../../models/auxFunctions';
import PasswordCharTest from '../pure/PasswordCharTest';
import useToken from '../../hooks/useToken';

const RegisterPage = () => {
    // History and contexts
    const history = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);
    const { saveToken } = useToken();
    const [isLoading, setIsLoading] = useState(false);


    // Error states
    const [userError, setUserError] = useState(false);
    const [userErrorMsg, setUserErrorMsg] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    
    const [pass1Error, setPass1Error] = useState(false);
    const [pass1ErrorMsg, setPass1ErrorMsg] = useState('');
    const [pass2Error, setPass2Error] = useState(false);
    const [pass2ErrorMsg, setPass2ErrorMsg] = useState('');
    
    // Refs
    const userRef = useRef();
    const emailRef = useRef();
    const pass1Ref = useRef();
    const pass2Ref = useRef();
    
    // Other states
    const [charConditions, setCharConditions] = useState();
    const [viewPass1, setViewPass1] = useState(false);
    const [viewPass2, setViewPass2] = useState(false);


    const resetEmailErrors = () => {
        setEmailError(false);
        setEmailErrorMsg('');
    }


    const handlePassChange = () => {
        // Check both's lengths and if they're equals
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
    }


    const createUser = async (newUser) => {
        return await axios.post(
            'http://127.0.0.1:8000/users/register',
            newUser
        ).then(response => {
            // Check if data is correct
            // console.log(response.data);

            // Return user's information
            return Promise.resolve(response.data);
        }).catch(error => {
            const errorType = error.response.data.detail.type;
            const errorMsg = error.response.data.detail.message;

            if (errorType === 'username') {
                setUserError(true);
                setUserErrorMsg(errorMsg);
            }

            if (errorType === 'email') {
                setEmailError(true);
                setEmailErrorMsg(errorMsg);
            }

            return Promise.reject(error);
        });
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (userError || pass1Error || pass2Error) {
            return;
        }

        setIsLoading(true);

        // Set new user to database
        const newUser = {
            username: userRef.current.value,
            email: emailRef.current.value,
            password: pass1Ref.current.value,
            image: ''
        };

        const data = await createUser(newUser).then(data => {
            return data;
        }).catch(error => {
            console.error('Create user error:', error);
        });

        if (!data) {
            setIsLoading(false);
            return
        };

        // Get and save new user's token
        const loginUser = {
            email: newUser.email,
            password: newUser.password
        }

        axios.post(
            'http://127.0.0.1:8000/users/login',
            loginUser
        ).then(response => {
            // Login the user
            setUser(data);
            setIsAuthenticated(true);
            // Save access token to localStorage
            saveToken(response.data.access_token);
            // Go to app's home page
            history('/');
        }).catch(error => {
            console.error('Get token error:', error);
        })

        setIsLoading(false);
    };

    return (
        <div id='register-page-wrapper' className='container'>
            <section>
                <form onSubmit={handleSubmit}>
                    <button type='button' className='icon-button go-back-button' onClick={() => history('/')}>
                        <FontAwesomeIcon icon='chevron-left' fixedWidth />
                        Go Back
                    </button>

                    <header>
                        <h2>Register</h2>
                        <p>First time here? We're happy to see you!</p>
                    </header>

                    <div className='input-label-wrapper'>
                        <input
                            id='register-username'
                            className={`input-field ${userError ? 'input-error' : ''}`}
                            ref={userRef}
                            onChange={() => checkUsername(
                                userRef.current.value,
                                setUserError,
                                setUserErrorMsg
                            )}
                            placeholder='YourUsername'
                            required
                            spellCheck={false}
                            type="text"
                        />
                        <label htmlFor='register-username' className='input-label'>
                            Username
                        </label>
                        <FontAwesomeIcon icon='user' className='input-icon' fixedWidth />
                        {userErrorMsg && <span className='error-message'>{userErrorMsg}</span>}
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            id='register-email'
                            className={`input-field ${emailError ? 'input-error' : ''}`}
                            ref={emailRef}
                            onChange={resetEmailErrors}
                            placeholder='your_email@example.com'
                            required
                            spellCheck={false}
                            type="email"
                        />
                        <label htmlFor='register-email' className='input-label'>
                            Email
                        </label>
                        <FontAwesomeIcon icon='at' className='input-icon' fixedWidth />
                        {emailErrorMsg && <span className='error-message'>{emailErrorMsg}</span>}
                    </div>

                    <div className='input-label-wrapper' id='password-wrapper'>
                        <input
                            id='register-password'
                            className={`input-field ${pass1Error ? 'input-error' : ''}`}
                            ref={pass1Ref}
                            onChange={handlePassChange}
                            placeholder='123_abCD'
                            required
                            type={viewPass1 ? 'text' : "password"}
                        />
                        <label htmlFor='register-password' className='input-label'>
                            Password
                        </label>
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
                            id='register-password-2'
                            className={`input-field ${pass2Error ? 'input-error' : ''}`}
                            ref={pass2Ref}
                            onChange={handlePassChange}
                            placeholder='123_abCD'
                            required
                            type={viewPass2 ? 'text' : "password"}
                        />
                        <label htmlFor='register-password-2' className='input-label'>
                            Confirm password
                        </label>
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

                    <nav>
                        <p>
                            Have an account? <NavLink to='/login'>Login</NavLink>
                        </p>

                        <button type='submit'>
                            {
                                isLoading ? (
                                    <FontAwesomeIcon icon='spinner' fixedWidth spin />
                                ) : (
                                    <>
                                        Register
                                    </>
                                )
                            }
                        </button>
                    </nav>
                </form>
            </section>

            <section className='img-side'>
                <img src={registerImg} alt="register"/>
            </section>
        </div>
    );
};


export default RegisterPage;