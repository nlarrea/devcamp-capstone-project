import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { HOME_CONTENT } from '../../models/constants';

const Carousel = ({ isAuthenticated }) => {
    const history = useNavigate();
    const [index, setIndex] = useState(0);
    const carouselIndicatorRef = useRef();

    const prevIndex = () => {
        const newIndex = index - 1 < 0 ? HOME_CONTENT.length - 1 : index - 1;
        updateActiveIndicator(newIndex);
    }

    const nextIndex = () => {
        const newIndex = index + 1 === HOME_CONTENT.length ? 0 : index + 1;
        updateActiveIndicator(newIndex);
    }

    const updateActiveIndicator = (newIndex) => {
        setIndex(newIndex);
        const childNodeList = carouselIndicatorRef.current.childNodes;

        for (let node of childNodeList) {
            node.classList.remove('active-indicator');
        }

        childNodeList[newIndex].classList.add('active-indicator');
    }

    const getStarted = () => {
        if (!isAuthenticated) {
            history('/login');
        } else {
            history('/blogs/new-blog')
        }
    }

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
                
                {/* <p>{HOME_CONTENT[index].text}</p> */}
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
                {/* <img src={HOME_CONTENT[index].image} alt="carousel item"/> */}
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