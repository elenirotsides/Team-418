import React, { useContext } from 'react';
import '../App.css';
import GoogleLogIn from './GoogleLogIn';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';

function Login() {
    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to='/' />;
    }

    return (
        <div className='text-center'>
            <h1>Log in</h1>
            <GoogleLogIn />
        </div>
    );
}

export default Login;
