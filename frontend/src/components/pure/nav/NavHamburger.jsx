import React, { useEffect, useRef } from 'react';

const NavHamburger = ({ isOpen, handleMenuState }) => {
    const checkRef = useRef();

    useEffect (() => {
        if (isOpen) {
            checkRef.current.checked = true;
        } else {
            checkRef.current.checked = false;
        }
    }, [isOpen]);


    return (
        <label className='left-nav-side switch' htmlFor='menu-switch'>
            <input
                ref={checkRef}
                type="checkbox"
                name="menu-switch"
                id="menu-switch"
                onClick={handleMenuState}
            />
            
            <div className='lines-wrapper'>
                <span className="line-1" />
                <span className="line-2" />
                <span className="line-3" />
            </div>
        </label>
    );
};


export default NavHamburger;