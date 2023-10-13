import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import loginImg from '../../static/images/forms/login.svg';
import useToken from '../../hooks/useToken';

const LoginPage = () => {
    const history = useNavigate();
    const { token, saveToken } = useToken();

    const login = (email, password) => {
        // petición a la API ??
    }

    const handleLogin = async (email, password) => {
        try {
            const newToken = await login(email, password);
            saveToken(newToken);
        } catch (error) {
            console.error('Login failed:', error.message);
        }
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

                        <button type='submit'>Login</button>
                    </nav>
                </form>
            </section>
        </div>
    );
};


export default LoginPage;