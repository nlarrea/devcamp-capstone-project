import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AuthService from '../../common/auth';
import { AuthContext, UserContext } from '../../context/authContext';
import loginImg from '../../static/images/forms/login.svg';

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format.')
        .required('Email is required.'),
    password: Yup.string()
        .required('Password is required.')
        .min(8, 'Password is too short!')
        .max(30, 'Password is too long!')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,30}$/,
            'At least 8 characters with 1 uppercase, 1 lowercase and 1 special.'
        )
})

const LoginPage = () => {
    const initialCredentials = {
        email: '',
        password: ''
    };

    const history = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);

    // States
    const [message, setMessage] = useState('');
    const [viewPass, setViewPass] = useState(false);


    const handleSubmit = async (values) => {
        setMessage('');
        
        await AuthService.login({
            email: values.email,
            password: values.password
        }).then(async (data) => {
            const obtainedToken = data.access_token;

            if (obtainedToken) {
                localStorage.setItem('token', obtainedToken);
                
                await AuthService.getCurrentUser().then(response => {
                    const obtainedUser = response.data;
                    setIsAuthenticated(true);
                    setUser(obtainedUser);
                });
            }

            history('/');
        }).catch(error => {
            const resMessage = (
                error.response &&
                error.response.data &&
                error.response.data.detail &&
                error.response.data.detail.message
                ) ||
                error.message ||
                error.toString();

            setMessage(resMessage);
        });
    };


    return (
        <div id='login-page-wrapper' className='container'>
            <section className="img-side">
                <img src={loginImg} alt="login"/>
            </section>

            <section>
                <Formik
                    // Initial values that the form will take
                    initialValues={initialCredentials}
                    // Yup validation schema
                    validationSchema={loginSchema}
                    validateOnChange={true}
                    // On submit event
                    onSubmit={handleSubmit}
                >
                    {/* Props from Formik */}
                    {({
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        setFieldTouched,
                        handleChange
                    }) => (
                        <Form>
                            <button type='button' className='icon-button go-back-button' onClick={() => history('/')}>
                                <FontAwesomeIcon icon='chevron-left' fixedWidth />
                                Go Back
                            </button>

                            <header>
                                <h2>Login</h2>
                                <p>Nice to see you again!</p>
                            </header>

                            <div className='input-label-wrapper'>
                                <Field
                                    id='login-email'
                                    className={`input-field ${errors.email ? 'input-error' : ''}`}
                                    name='email'
                                    placeholder='your_email@example.com'
                                    type='email'
                                    value={values.email}
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldTouched('email', true, false);
                                        setMessage('');
                                    }}
                                />
                                <label htmlFor='login-email' className='input-label'>Email</label>
                                <FontAwesomeIcon icon='at' className='input-icon' fixedWidth />
                                {
                                    errors.email && touched.email && (
                                        <ErrorMessage
                                            name='email'
                                            component='span'
                                            className='error-message'
                                        />
                                    )
                                }
                            </div>
                            
                            <div className='input-label-wrapper'>
                                <Field
                                    id='login-password'
                                    className={`input-field ${errors.password ? 'input-error' : ''}`}
                                    name='password'
                                    placeholder='1234ABcd_'
                                    type={viewPass ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldTouched('password', true, false);
                                        setMessage('');
                                    }}
                                />
                                <label htmlFor='login-password' className='input-label'>Password</label>
                                {
                                    viewPass ? (
                                        <FontAwesomeIcon
                                            icon='lock-open'
                                            className='input-icon icon-btn'
                                            fixedWidth
                                            onClick={() => setViewPass(false)}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon='lock'
                                            className='input-icon icon-btn'
                                            fixedWidth
                                            onClick={() => setViewPass(true)}
                                        />
                                    )
                                }
                                {
                                    errors.password && touched.password && (
                                        <ErrorMessage
                                            name='password'
                                            component='span'
                                            className='error-message'
                                        />
                                    )
                                }
                            </div>

                            <nav>
                                <p>
                                    First time here? <NavLink to='/register'>Register</NavLink>
                                </p>

                                <button type='submit' disabled={isSubmitting}>
                                    {
                                        isSubmitting ? (
                                            <FontAwesomeIcon icon='spinner' fixedWidth spin />
                                        ) : (
                                            'Login'
                                        )
                                    }
                                </button>

                                {
                                    message &&
                                    <p className='api-error-message'>{message}</p>
                                }
                            </nav>
                        </Form>
                    )}
                </Formik>
            </section>
        </div>
    );
};


export default LoginPage;