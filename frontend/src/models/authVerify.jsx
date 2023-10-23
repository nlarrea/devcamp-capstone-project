import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        return null;
    }
};


const AuthVerify = ({ logOut }) => {
    const location = useLocation();

    useEffect (() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedJwt = parseJwt(token);

            if (decodedJwt?.exp * 1000 < Date.now()) {
                logOut();
            }
        }
    }, [location, logOut]);

    return;
}


export default AuthVerify;