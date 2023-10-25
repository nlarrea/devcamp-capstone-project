import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { nChars } from '../../models/constants';


/**
 * The Yup register schema. It defines all the inputs from the register form.
 */
const registerSchema = Yup.object().shape({
    username: Yup.string()
        .min(nChars.username.min, `Min ${nChars.username.min} characters!`)
        .max(nChars.username.max, `Max ${nChars.username.max} characters!`)
        .required('Username is required.'),
    email: Yup.string()
        .email('Invalid email format.')
        .required('Email is required.'),
    password: Yup.string()
        .min(nChars.password.min, `Min ${nChars.password.min} characters!`)
        .max(nChars.password.max, `Max ${nChars.password.max} characters!`)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,30}$/,
            'At least 1 uppercase, 1 lowercase and 1 special character.'
        )
        .required('Password is required.'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Both passwords must be equals!')
});


const RegisterForm = ({ handleSubmit, setMessage, message }) => {
    // Constants
    const history = useNavigate();
    // States
    const [viewPass1, setViewPass1] = useState(false);
    const [viewPass2, setViewPass2] = useState(false);

    // Formik initial values
    const initialCredentials = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };


    return (
        <Formik
            // Initial values that the form will take
            initialValues={initialCredentials}
            // Yup validation schema
            validationSchema={registerSchema}
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
                        <h2>Register</h2>
                        <p>First time here? We're happy to see you!</p>
                    </header>

                    <div className='input-label-wrapper'>
                        <Field
                            id='register-username'
                            name='username'
                            className={`input-field ${errors.username ? 'input-error' : ''}`}
                            onChange={e => {
                                handleChange(e);
                                setFieldTouched('username', true, false);
                                setMessage('');
                            }}
                            placeholder='YourUsername'
                            value={values.username}
                            spellCheck={false}
                            type="text"
                            autoFocus={true}
                        />
                        <label htmlFor='register-username' className='input-label'>
                            Username
                        </label>
                        <FontAwesomeIcon icon='user' className='input-icon' fixedWidth />
                        {
                            errors.username && touched.username && (
                                <ErrorMessage
                                    name='username'
                                    component='span'
                                    className='error-message'
                                />
                            )
                        }
                    </div>

                    <div className='input-label-wrapper'>
                        <Field
                            id='register-email'
                            name='email'
                            className={`input-field ${errors.email ? 'input-error' : ''}`}
                            onChange={e => {
                                handleChange(e);
                                setFieldTouched('email', true, false);
                                setMessage('');
                            }}
                            placeholder='your_email@example.com'
                            spellCheck={false}
                            type="email"
                        />
                        <label htmlFor='register-email' className='input-label'>
                            Email
                        </label>
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

                    <div className='input-label-wrapper' id='password-wrapper'>
                        <Field
                            id='register-password'
                            name='password'
                            className={`input-field ${errors.password ? 'input-error' : ''}`}
                            onChange={e => {
                                handleChange(e);
                                setFieldTouched('password', true, false);
                            }}
                            placeholder='123_abCD'
                            type={viewPass1 ? 'text' : "password"}
                        />
                        <label htmlFor='register-password' className='input-label'>
                            Password
                        </label>
                        {
                            viewPass1 ? (
                                <FontAwesomeIcon
                                    onClick={() => setViewPass1(!viewPass1)}
                                    icon='unlock'
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

                    <div className='input-label-wrapper'>
                        <Field
                            id='register-password-2'
                            name='confirmPassword'
                            className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                            onChange={e => {
                                handleChange(e);
                                setFieldTouched('confirmPassword', true, false);
                            }}
                            placeholder='123_abCD'
                            type={viewPass2 ? 'text' : "password"}
                        />
                        <label htmlFor='register-password-2' className='input-label'>
                            Confirm password
                        </label>
                        {
                            viewPass2 ? (
                                <FontAwesomeIcon
                                    onClick={() => setViewPass2(!viewPass2)}
                                    icon='unlock'
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
                        {
                            errors.confirmPassword && touched.confirmPassword && (
                                <ErrorMessage
                                    name='confirmPassword'
                                    component='span'
                                    className='error-message'
                                />
                            )
                        }
                    </div>

                    <nav>
                        <p>
                            Do you have an account? <NavLink to='/login'>Login</NavLink>
                        </p>

                        <button type='submit' disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <FontAwesomeIcon icon='spinner' fixedWidth spin />
                                ) : (
                                    'Register'
                                )
                            }
                        </button>

                        {
                            message && (
                                <p className='api-error-message'>{message}</p>
                            )
                        }
                    </nav>
                </Form>
            )}
        </Formik>
    );
};


export default RegisterForm;