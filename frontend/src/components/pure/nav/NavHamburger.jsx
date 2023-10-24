import React from 'react';

const NavHamburger = ({ openModal }) => {
    return (
        <label className='left-nav-side switch' htmlFor='menu-switch'>
            <input
                type="checkbox"
                name="menu-switch"
                id="menu-switch"
                onClick={openModal}
            />
            
            <div>
                <span className="line-1" />
                <span className="line-2" />
                <span className="line-3" />
            </div>
        </label>
    );
};


export default NavHamburger;