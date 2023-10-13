import React, { useContext, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import useToken from '../../hooks/useToken';
import { AuthContext, UserContext } from '../../context/authContext';
import loginImg from '../../static/images/forms/login.svg';

const LoginPage = () => {
    const history = useNavigate();
    const { token, saveToken } = useToken();
    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);

    // State
    const [isLoading, setIsLoading] = useState(false);

    // Refs
    const emailRef = useRef();
    const passRef = useRef();


    const login = () => {
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

        setIsLoading(false);
    };


    const handleLogin = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        const loginUser = {
            email: emailRef.current.value,
            password: passRef.current.value
        };

        // Get access token
        await axios.post(
            'http://127.0.0.1:8000/login',
            loginUser
        ).then(response => {
            // Check if data is correct
            // console.log(response.data);

            // Save token to localStorage
            saveToken(response.data.access_token);
        }).catch(error => {
            console.error('auth error:', error);
        });

        setIsLoading(false);
        login();
    };


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
                            className='input-field'
                            placeholder='your_email@example.com'
                            required
                            spellCheck={false}
                            type="email"
                        />
                        <label htmlFor="login-email" className='input-label'>
                            Email
                        </label>
                        <FontAwesomeIcon icon='at' className='input-icon' fixedWidth />
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            ref={passRef}
                            id='login-password'
                            className='input-field'
                            placeholder='1234_abCD'
                            required
                            type="password"
                        />
                        <label htmlFor="login-password" className='input-label'>
                            Password
                        </label>
                        <FontAwesomeIcon icon='lock' className='input-icon' fixedWidth />
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