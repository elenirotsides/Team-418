import React, { useContext } from 'react';
import '../App.css';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import GoogleLogIn from './GoogleLogIn';

function SignUp() {
    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to='/' />;
    }

    return (
        <div className='text-center'>
            <h1>Sign up</h1>
            <GoogleLogIn />
        </div>
    );
}

export default SignUp;
