import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext, UserContext } from '../../../context/authContext';
import registerImg from '../../../static/images/forms/register.svg';
import AuthService from '../../../services/auth';
import RegisterForm from '../../forms/RegisterForm';


const RegisterPage = () => {
    // History and contexts
    const history = useNavigate();

    const [message, setMessage] = useState('');
    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);
    

    const handleSubmit = async (values) => {
        setMessage('');

        await AuthService.register({
            username: values.username,
            email: values.email,
            password: values.password
        }).then(async (response) => {
            const obtainedUser = response.data;
            
            await AuthService.login({
                email: values.email,
                password: values.password
            }).then(async (data) => {
                const obtainedToken = data.access_token;

                if (obtainedToken) {
                    localStorage.setItem('token', obtainedToken);
                }
            });

            setUser(obtainedUser);
            setIsAuthenticated(true);
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
        <div id='register-page-wrapper' className='container'>
            <section>
                <RegisterForm
                    handleSubmit={handleSubmit}
                    setMessage={setMessage}
                    message={message}
                />
            </section>

            <section className='img-side'>
                <img src={registerImg} alt="register"/>
            </section>
        </div>
    );
};


export default RegisterPage;