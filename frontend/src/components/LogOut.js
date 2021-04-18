import React from 'react';
import { doLogOut } from '../firebase/FirebaseFunctions';

const LogOutButton = () => {
    return (
        <button type="button" onClick={doLogOut}>
            Log out
        </button>
    );
};
export default LogOutButton;
