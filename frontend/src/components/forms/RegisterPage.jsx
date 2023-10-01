import React, { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import axios from 'axios';

import registerImg from '../../static/images/forms/register.svg';

const RegisterPage = () => {
    const history = useNavigate();
    const [userError, setUserError] = useState(false);
    const [userErrorMsg, setUserErrorMsg] = useState('');
    const userRef = useRef();

    const [passError, setPassError] = useState(false);
    const [passErrorMsg, setPassErrorMsg] = useState('');
    const pass1Ref = useRef();
    const pass2Ref = useRef();

    const emailRef = useRef();

    const [viewPass1, setViewPass1] = useState(false);
    const [viewPass2, setViewPass2] = useState(false);


    const checkUsername = () => {
        const forbiddenChars = /[@#$%^&*()=+,]/g
        if (userRef.current.value.length < 6) {
            setUserError(true);
            setUserErrorMsg('Username must be at least 6 characters.');
            return false;
        } else if (userRef.current.value.length > 30) {
            setUserError(true);
            setUserErrorMsg('Username must be less than 30 characters.');
            return false;
        } else if (forbiddenChars.test(userRef.current.value)) {
            setUserError(true);
            setUserErrorMsg('Valid special characters: ".", "-", "_"');
            return false;
        }

        return true;
    }

    const checkPasswords = () => {
        const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[,.*_&])[A-z\d,.*_&]{8,}$/;
        const hasUpper = /(?=.*[A-Z]{1,})/.test(pass1Ref.current.value);
        const hasLower = /(?=.*[a-z]{1,})/.test(pass1Ref.current.value);
        const hasNumber = /(?=.*\d){1,}/.test(pass1Ref.current.value);
        const hasSpecial = /(?=.*[.,*_&])/.test(pass1Ref.current.value);

        if (pass1Ref.current.value !== pass2Ref.current.value) {
            setPassError(true);
            setPassErrorMsg('Both passwords must be equals.');
            return false;
        } else if (pass1Ref.current.value.length < 8) {
            setPassError(true);
            setPassErrorMsg('Password must be at least 8 characters.');
            return false;
        } else if (!passRegex.test(pass1Ref.current.value)) {
            setPassError(true);
            setPassErrorMsg('Password doesn\'t meet the conditions.');
            alert(
                `Password must include at least:\n\
                - 1 upper char ${hasUpper ? '' : ' - (Not inserted)'}\n\
                - 1 lower char ${hasLower ? '' : ' - (Not inserted)'}\n\
                - 1 numeric char ${hasNumber ? '' : ' - (Not inserted)'}\n\
                - One of these: . , * _ & ${hasSpecial ? '' : ' - (Not inserted)'}`
            );
            return false;
        }

        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const correctUser = checkUsername();
        const correctPassword = checkPasswords();

        if (correctUser && correctPassword) {
            const newUser = {
                username: userRef.current.value,
                email: emailRef.current.value,
                password: pass1Ref.current.value
            };

            /* axios.post(
                'http://127.0.0.1:8000/register',
                newUser,
                { withCredentials: true }
            ).then(response => {
                    console.log(response.data);
            }).catch(error => {
                console.log(error);
            }); */
        }
    }

    // Reset values
    const handleChange = (inputId) => {
        if (inputId === 'register-username') {
            setUserError(false);
            setUserErrorMsg('');
        } else if (
            inputId === 'register-password' ||
            inputId === 'register-password-2'
        ) {
            setPassError(false);
            setPassErrorMsg('');
        }
    }


    return (
        <div id='register-page-wrapper' className='container'>
            <section>
                <form onSubmit={handleSubmit}>
                    <button className='icon-button go-back-button' onClick={() => history('/')}>
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
                            onChange={() => handleChange(userRef.current.id)}
                            placeholder='YourUsername'
                            required
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
                            className='input-field'
                            ref={emailRef}
                            placeholder='your_email@example.com'
                            required
                            type="email"
                        />
                        <label htmlFor='register-email' className='input-label'>
                            Email
                        </label>
                        <FontAwesomeIcon icon='at' className='input-icon' fixedWidth />
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            id='register-password'
                            className={`input-field ${passError ? 'input-error' : ''}`}
                            ref={pass1Ref}
                            onChange={() => handleChange(pass1Ref.current.id)}
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
                        {passErrorMsg && <span className='error-message'>{passErrorMsg}</span>}
                    </div>

                    <div className='input-label-wrapper'>
                        <input
                            id='register-password-2'
                            className={`input-field ${passError ? 'input-error' : ''}`}
                            ref={pass2Ref}
                            onChange={() => handleChange(pass1Ref.current.id)}
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
                        {passErrorMsg && <span className='error-message'>{passErrorMsg}</span>}
                    </div>

                    <nav>
                        <p>
                            Have an account? <NavLink to='/login'>Login</NavLink>
                        </p>

                        <button>Register</button>
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