import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { nChars } from '../../models/constants';


/**
 * The Yup login schema. It defines all the inputs from the login form.
 */
const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format.')
        .required('Email is required.'),
    password: Yup.string()
        .required('Password is required.')
        .min(nChars.password.min, `Min ${nChars.password.min} characters!`)
        .max(nChars.password.max, `Max ${nChars.password.max} characters!`)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,30}$/,
            'At least 1 uppercase, 1 lowercase and 1 special character.'
        )
});


const LoginForm = ({ handleSubmit, setMessage, message }) => {
    // Constants
    const history = useNavigate();
    // States
    const [viewPass, setViewPass] = useState(false);

    // Formik initial values
    const initialCredentials = {
        email: '',
        password: ''
    };

    return (
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
                    <button
                        type='button'
                        className='icon-button go-back-button'
                        onClick={() => history('/')}
                    >
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
                            autoFocus={true}
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
                                    icon='unlock'
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
    );
};


export default LoginForm;