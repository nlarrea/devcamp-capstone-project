import React from 'react';

const PasswordCharTest = ({ hasUpper, hasLower, hasNumber, hasSpecial }) => {
    return (
        <div id='password-char-conditions'>
            <div className='char-check-condition-wrapper'>
                <input
                    className='char-check-list'
                    type='checkbox'
                    readOnly
                    checked={hasUpper}
                />
                <span>At least 1 UPPERCASE character.</span>
            </div>

            <div className='char-check-condition-wrapper'>
                <input
                    className='char-check-list'
                    type='checkbox'
                    readOnly
                    checked={hasLower}
                />
                <span>At least 1 lowercase character.</span>
            </div>

            <div className='char-check-condition-wrapper'>
                <input
                    className='char-check-list'
                    type='checkbox'
                    readOnly
                    checked={hasNumber}
                />
                <span>At least 1 Number character.</span>
            </div>

            <div className='char-check-condition-wrapper'>
                <input
                    className='char-check-list'
                    type='checkbox'
                    readOnly
                    checked={hasSpecial}
                />
                <span>At least 1 of the following: <code>. , * _ &</code></span>
            </div>
        </div>
    );
};


export default PasswordCharTest;