import React, { useContext, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import useToken from '../../hooks/useToken';
import { AuthContext, UserContext } from '../../context/authContext';
import loginImg from '../../static/images/forms/login.svg';

const LoginPage = () => {
    const history = useNavigate();
    const { saveToken } = useToken();
    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);

    // States
    const [isLoading, setIsLoading] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [emailErrorMsg, setEmailErrorMsg] = useState('');

    const [passError, setPassError] = useState(false);
    const [passErrorMsg, setPassErrorMsg] = useState('');
    const [viewPass, setViewPass] = useState(false);

    // Refs
    const emailRef = useRef();
    const passRef = useRef();


    const loginUser = async (loginUserData) => {
        // Get access token
        return await axios.post(
            'http://127.0.0.1:8000/users/login',
            loginUserData
        ).then(response => {
            // Check if data is correct
            // console.log(response.data);

            // Save token to localStorage
            saveToken(response.data.access_token);
            return response.data.access_token;
        }).catch(error => {
            // Print the error in the console
            // console.error('auth error:', error);

            // Print the error in the form
            const errorType = error.response.data.detail.type;
            const errorMsg = error.response.data.detail.message;

            if (errorType === 'email') {
                setEmailError(true);
                setEmailErrorMsg(errorMsg);
            }

            if (errorType === 'password') {
                setPassError(true);
                setPassErrorMsg(errorMsg);
            }
        });
    };

    const getUser = (token) => {
        // Get user's data after being authorized
        axios.get(
            'http://127.0.0.1:8000/users/me', {
                headers: { Authorization: `Bearer ${token}`}
            }
        ).then(response => {
            // Check if data is correct
            // console.log(response.data);

            // Login the user with the given credentials
            setIsAuthenticated(true);
            const userDb = response.data;
            setUser(userDb);
            history('/');
        }).catch(error => {
            console.error('login error:', error);
        });
    }


    const handleLogin = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        const loginUserData = {
            email: emailRef.current.value,
            password: passRef.current.value
        };

        // Get access token
        const createdToken = await loginUser(loginUserData);

        // Get user's data if token is valid
        if (createdToken) {
            getUser(createdToken);
        }

        setIsLoading(false);
    };


    const resetErrors = () => {
        setEmailError(false);
        setEmailErrorMsg('');

        setPassError(false);
        setPassErrorMsg('');
    }


    return (
        <div id='login-page-wrapper' className='container'>
            <section className="img-side">
                <img src={loginImg} alt="login"/>
            </section>

            <section>
                <form onSubmit={handleLogin}>
                    <button type='button' className='icon-button go-back-button' onClick={() => history('/')}>
                        <FontAwesomeIcon icon='chevron-left' fixedWidth />
                        Go Back
                    </button>

                    <header>
                        <h2>Login</h2>
                        <p>Nice to see you again!</p>
                    </header>

                    <div className='input-label-wrapper'>
                        <input
                            ref={emailRef}
                            id='login-email'
                            onChange={resetErrors}
                            className={`input-field ${emailError ? 'input-error' : ''}`}
                            placeholder='your_email@example.com'
                            required
                            spellCheck={false}
                            type="email"
                        />
                        <label htmlFor="login-email" className='input-label'>
                            Email
                        </label>
                        <FontAwesomeIcon icon='at' className='input-icon' fixedWidth />
                        {emailError && <span className='error-message'>{emailErrorMsg}</span>}
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            ref={passRef}
                            id='login-password'
                            onChange={resetErrors}
                            className={`input-field ${passError ? 'input-error' : ''}`}
                            placeholder='1234_abCD'
                            required
                            type={viewPass ? 'text' : "password"}
                        />
                        <label htmlFor="login-password" className='input-label'>
                            Password
                        </label>
                        {
                            viewPass ? (
                                <FontAwesomeIcon
                                    onClick={() => setViewPass(!viewPass)}
                                    icon='lock-open'
                                    className='input-icon icon-btn'
                                    fixedWidth
                                />
                            ) : (
                                <FontAwesomeIcon
                                    onClick={() => setViewPass(!viewPass)}    
                                    icon='lock'
                                    className='input-icon icon-btn'
                                    fixedWidth
                                />
                            )
                        }
                        {passError && <span className='error-message'>{passErrorMsg}</span>}
                    </div>

                    <nav>
                        <p>
                            First time here? <NavLink to='/register'>Register</NavLink>
                        </p>

                        <button type='submit'>
                            {
                                isLoading ? (
                                    <FontAwesomeIcon icon='spinner' fixedWidth spin />
                                ) : (
                                    <>
                                        Login
                                    </>
                                )
                            }
                        </button>
                    </nav>
                </form>
            </section>
        </div>
    );
};


export default LoginPage;