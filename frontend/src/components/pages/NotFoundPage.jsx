import { NavLink } from 'react-router-dom';
import PATHS from '../../models/paths';

const NotFoundPage = () => {
    return (
        <div id='page-not-found-wrapper' className='container'>
            <main>
                <h1>Oops!</h1>
                <h2>404 - Page Not Found</h2>
                <p>
                    The page you are looking for might have been removed, had its 
                    name changed or is temporarily unavailable.
                </p>
                <NavLink to={PATHS.welcome}>Go to homepage</NavLink>
            </main>
        </div>
    );
};


export default NotFoundPage;