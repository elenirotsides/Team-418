import React from 'react';
import { doLogOut } from '../firebase/FirebaseFunctions';

const LogOutButton = () => {
    return (
        <button className="btn" style= {{color: 'white', backgroundColor: '#0061c9'}} type="button" onClick={doLogOut}>
            Log out
        </button>
    );
};
export default LogOutButton;
