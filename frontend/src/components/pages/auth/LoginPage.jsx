import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthService from '../../../services/auth';
import { AuthContext, UserContext } from '../../../context/authContext';
import LoginForm from '../../forms/LoginForm';
import loginImg from '../../../static/images/forms/login.svg';
import PATHS from '../../../models/paths';


const LoginPage = () => {
    // Constants
    const history = useNavigate();
    // Contexts
    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);
    // States
    const [message, setMessage] = useState('');


    /**
     * Sends the data to the API through the AuthService and authenticates the
     * user if the API returns an OK.
     * @param {*} values Input values from the form.
     */
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

            history(PATHS.welcome);
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
                <LoginForm
                    handleSubmit={handleSubmit}
                    setMessage={setMessage}
                    message={message}
                />
            </section>
        </div>
    );
};


export default LoginPage;