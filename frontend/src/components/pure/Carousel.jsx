import { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AuthContext } from '../../context/authContext';
import { HOME_CONTENT } from '../../models/constants';
import PATHS from '../../models/paths';

const Carousel = () => {
    // Constants
    const history = useNavigate();
    // Context
    const { isAuthenticated } = useContext(AuthContext);
    // States and Refs
    const [index, setIndex] = useState(0);
    const carouselIndicatorRef = useRef();


    /**
     * Gets the previous index of the item list. It it is the first one, the
     * next is the last one.
     */
    const prevIndex = () => {
        const newIndex = index - 1 < 0 ? HOME_CONTENT.length - 1 : index - 1;
        updateActiveIndicator(newIndex);
    }


    /**
     * Gets the next index of the item list. If it is the last one, the next is
     * the first one.
     */
    const nextIndex = () => {
        const newIndex = index + 1 === HOME_CONTENT.length ? 0 : index + 1;
        updateActiveIndicator(newIndex);
    }


    /**
     * Gets the new index and modifies the 'active' class of the carousel
     * indicator.
     * @param {*} newIndex New value of the index.
     */
    const updateActiveIndicator = (newIndex) => {
        setIndex(newIndex);
        const childNodeList = carouselIndicatorRef.current.childNodes;

        for (let node of childNodeList) {
            node.classList.remove('active-indicator');
        }

        childNodeList[newIndex].classList.add('active-indicator');
    }


    /**
     * Sends the user to the 'next step' in this app.
     */
    const getStarted = () => {
        if (!isAuthenticated) {
            history(PATHS.login);
        } else {
            history(PATHS.newBlog)
        }
    }


    useEffect (() => {
        const timer = setTimeout(() => {
            nextIndex();
        }, 5000);

        return () => clearTimeout(timer);
    });
    

    return (
        <div className='carousel-wrapper'>
            <button className='icon-button prev-button' onClick={prevIndex}>
                <FontAwesomeIcon icon='chevron-left' fixedWidth />
            </button>
            <button className='icon-button next-button' onClick={nextIndex}>
                <FontAwesomeIcon icon='chevron-right' fixedWidth />
            </button>

            <section className='text-section'>
                <header className='welcome-page-title'>
                    <h1>Welcome</h1>
                </header>
                
                <div className='carousel-text-wrapper'>
                    {
                        HOME_CONTENT.map(({text}, idx) => (
                            <p 
                                key={text}
                                className={`carousel-text ${idx === index && 'active-text'}`}
                            >
                                {text}
                            </p>
                        ))
                    }
                </div>
                
                <div className='carousel-active-item-indicators' ref={carouselIndicatorRef}>
                    <button
                        className='carousel-indicator active-indicator'
                        onClick={() => updateActiveIndicator(0)}
                    />
                    <button
                        className='carousel-indicator'
                        onClick={() => updateActiveIndicator(1)}
                    />
                    <button
                        className='carousel-indicator'
                        onClick={() => updateActiveIndicator(2)}
                    />
                </div>
                
                <button
                    className='welcome-button'
                    onClick={getStarted}
                >Tell us your story</button>
            </section>

            <section className='image-section'>
                {
                    HOME_CONTENT.map(({image}, idx) => (
                        <img
                            key={image}
                            src={image}
                            className={`carousel-img ${idx === index && 'active-img'}`}
                            alt='carousel item'
                        />
                    ))
                }
            </section>
        </div>
    );
};


export default Carousel;