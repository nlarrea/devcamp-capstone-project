import React from 'react';
import { NavLink } from 'react-router-dom';

import avatar from '../../../static/images/avatars/user_avatar.svg';

const UserAvatar = ({ user }) => {
    return (
        <NavLink to={`/users/me`} className='nav-user-data-wrapper'>
            <div className='nav-user-img-wrapper'>
                <span className='nav-user-circle-out' />
                <span className='nav-user-circle-in' />
                {
                    user?.image ? (
                        <div
                            id='logged-user-nav-img'
                            style={{
                                backgroundImage: `url(${user?.image.replace('dataimage/jpegbase64', 'data:image/jpeg;base64,')})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '50%'
                            }}
                        />
                    ) : (
                        <img
                            id='logged-user-nav-img'
                            src={avatar}
                            alt="user avatar"
                        />
                    )
                }
            </div>
        </NavLink>
    );
};


export default UserAvatar;