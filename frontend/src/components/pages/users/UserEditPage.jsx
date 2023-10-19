import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AuthService from '../../../common/auth';
import { AuthContext, UserContext } from '../../../context/authContext';
import avatar from '../../../static/images/avatars/user_avatar.svg';
import FileBase64 from '../../pure/FileBase64';
import { nChars } from '../../../models/constants';


const userEditSchema = yup.object().shape({
    username: yup.string()
        .min(nChars.username.min, `Min ${nChars.username.min} characters!`)
        .max(nChars.username.max, `Max ${nChars.username.max} characters!`),
    email: yup.string()
        .email('Invalid email format'),
    oldPassword: yup.string()
        .min(nChars.password.min, `Min ${nChars.password.min} characters!`)
        .max(nChars.password.max, `Max ${nChars.password.max} characters!`)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,30}$/,
            'At least 1 upper, 1 lower and 1 special char.'
        )
        .required("The old password is required!"),
    newPassword: yup.string()
        .min(nChars.password.min, `Min ${nChars.password.min} characters!`)
        .max(nChars.password.max, `Max ${nChars.password.max} characters!`)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,30}$/,
            'At least 1 uppercase, 1 lowercase and 1 special character.'
        ),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], 'Both passwords must be equals!')
});


const UserEditPage = () => {
    // Contexts & global variable's state
    const history = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);
    const { user, setUser } = useContext(UserContext);
    
    // Image states and values
    const originalImg = user?.image || null;
    const [image, setImage] = useState(originalImg ? originalImg : null);
    const [editImgMode, setEditImgMode] = useState(false);

    // Passwords
    const [oldPasswordValue, setOldPasswordValue] = useState('');
    const [viewOldPass, setViewOldPass] = useState(false);
    const [viewPass1, setViewPass1] = useState(false);
    const [viewPass2, setViewPass2] = useState(false);

    // Any error message from API
    const [message, setMessage] = useState('');


    const initialCredentials = {
        username: '',
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };


    const handleRemoveImg = () => {
        setEditImgMode(true);
        setImage(null);
    }


    const handleCancelImg = () => {
        setEditImgMode(false);
        setImage(originalImg);
    }


    const showApiErrors = (error) => {
        const resMessage = (
            error.response &&
            error.response.data &&
            error.response.data.detail &&
            error.response.data.detail.message
            ) ||
            error.message ||
            error.toString();

        setMessage(resMessage);
    }


    const handleSubmit = async (values) => {
        setMessage('');

        await AuthService.updateUser({
            username: values.username,
            email: values.email,
            old_password: values.oldPassword,
            new_password: values.newPassword,
            image: image || ''
        }).then(async (response) => {
            const obtainedToken = response.data.access_token;

            if (obtainedToken) {
                localStorage.setItem('token', obtainedToken);

                await AuthService.getCurrentUser().then(response => {
                    const obtainedUser = response.data;
                    setUser(obtainedUser);
                });
            }
        }).catch(error => {
            showApiErrors(error);
        })
    }


    const handleRemoveAccount = (event) => {
        event.preventDefault();

        AuthService.removeAccount(
            oldPasswordValue
        ).then(() => {
            setUser({});
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            history('/');
        }).catch(error => {
            showApiErrors(error);
        })
    }


    return (
        <Formik
            // Initial values that the form will take
            initialValues={initialCredentials}
            // Yup validation schema
            validationSchema={userEditSchema}
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
                <Form
                    id='edit-user-data-page-wrapper'
                    className='container'
                >
                    <main> {/* this should be the form */}
                        <section>
                            <div className='input-label-wrapper'>
                                <Field
                                    id='username-input'
                                    name='username'
                                    className={`input-field ${errors.username ? 'input-error' : ''}`}
                                    type='text'
                                    placeholder='YourUsername'
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldTouched('username', true, false);
                                        setMessage('');
                                    }}
                                    value={values.username}
                                    spellCheck={false}
                                />
                                <label
                                    htmlFor="username-input"
                                    className='input-label'
                                >Username</label>
                                <FontAwesomeIcon icon='user' className='input-icon' />
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
                                    id='email-input'
                                    name='email'
                                    className={`input-field ${errors.email ? 'input-error' : ''}`}
                                    type='email'
                                    placeholder='your_email@example.com'
                                    value={values.email}
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldTouched('email', true, false);
                                        setMessage('');
                                    }}
                                    spellCheck={false}
                                />
                                <label
                                    htmlFor="email-input"
                                    className='input-label'
                                >Email</label>
                                <FontAwesomeIcon icon='at' className='input-icon' />
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
                                    id='original-password'
                                    name='oldPassword'
                                    className={`input-field ${errors.oldPassword ? 'input-error' : ''}`}
                                    type={viewOldPass ? 'text' : "password"}
                                    placeholder='1234ABcd_'
                                    onChange={e => {
                                        setOldPasswordValue(e.target.value);
                                        handleChange(e);
                                        setFieldTouched('oldPassword', true, false);
                                    }}
                                    spellCheck={false}
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
                                            icon='unlock'
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
                                {
                                    errors.oldPassword && touched.oldPassword && (
                                        <ErrorMessage
                                            name='oldPassword'
                                            component='span'
                                            className='error-message'
                                        />
                                    )
                                }
                            </div>

                            <div className='input-label-wrapper' id='password-wrapper'>
                                <Field
                                    id='password-1'
                                    name='newPassword'
                                    className={`input-field ${errors.newPassword ? 'input-error' : ''}`}
                                    type={viewPass1 ? 'text' : "password"}
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldTouched('newPassword', true, false);
                                    }}
                                    placeholder='_abCD1234'
                                />
                                <label
                                    htmlFor="password-1"
                                    className='input-label'
                                >New Password</label>
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
                                    errors.newPassword && touched.newPassword && (
                                        <ErrorMessage
                                            name='newPassword'
                                            component='span'
                                            className='error-message'
                                        />
                                    )
                                }
                            </div>

                            <div className='input-label-wrapper'>
                                <Field
                                    id='password-2'
                                    name='confirmPassword'
                                    className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                                    type={viewPass2 ? 'text' : "password"}
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldTouched('confirmPassword', true, false);
                                    }}
                                    placeholder='_abCD1234'
                                />
                                <label
                                    htmlFor="password-2"
                                    className='input-label'
                                >Confirm New Password</label>
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

                            <button
                                type='button'
                                onClick={handleRemoveAccount}
                                id='remove-user-btn'
                            >Remove account</button>
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
                                            type='button'
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
                                            type='button'
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
                            className='form-btn'
                            disabled={isSubmitting}
                        >
                            {
                                isSubmitting ? (
                                    <FontAwesomeIcon icon='spinner' fixedWidth spin />
                                ) : (
                                    'Confirm Changes'
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


export default UserEditPage;
