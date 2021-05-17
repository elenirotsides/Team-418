import React from 'react';
import { doLogOut } from '../firebase/FirebaseFunctions';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
    buttons: {
        color: 'white',
        backgroundColor: '#0061c9',
    },
});

const LogOutButton = () => {
    const classes = styles();
    return (
        <button class={`btn ${classes.buttons}`} type="button" onClick={doLogOut}>
            Log out
        </button>
    );
};
export default LogOutButton;
