import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Carousel from '../pure/Carousel';
import NavBar from '../pure/NavBar';

const WelcomePage = ({ isAuthenticated, user }) => {
    return (
        <div id='welcome-page' className='container'>
            <NavBar isAuthenticated={isAuthenticated} user={user} />

            <Carousel />

            <section className='summary-section'>
                <div>
                    <FontAwesomeIcon icon='mobile' fixedWidth />
                    <p>Bring out the writer in you <strong>from anywhere</strong>.</p>
                </div>

                <div>
                    <FontAwesomeIcon icon='rocket' fixedWidth />
                    <p>Let your <strong>imagination</strong> run wild with stories <strong>from all over the galaxy</strong>!</p>
                </div>

                <div>
                    <FontAwesomeIcon icon='newspaper' fixedWidth />
                    <p>Always be <strong>up to date</strong> with the latest news.</p>
                </div>
            </section>

            <footer>
                
            </footer>
        </div>
    );
};


export default WelcomePage;