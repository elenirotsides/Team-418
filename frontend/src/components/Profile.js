import React from 'react';
import SignOutButton from './LogOut';
import ChangePassword from './ChangePassword';

const Profile = (props) => {
    return (
        <div className="text-center">
            <h2>Profile Page</h2>
            <ChangePassword />
            <SignOutButton />
        </div>
    );
};

export default Profile;
