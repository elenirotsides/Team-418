import React from 'react';
import { doLogOut } from '../firebase/FirebaseFunctions';

const LogOutButton = () => {
    return (
        <button className="btn btn-primary" type="button" onClick={doLogOut}>
            Log out
        </button>
    );
};
export default LogOutButton;
