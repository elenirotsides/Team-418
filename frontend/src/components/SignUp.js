import React, { useContext, useState } from 'react';
import '../App.css';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import GoogleLogIn from './GoogleLogIn';

function SignUp() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPWMatch] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { firstName, lastName, displayName, email, passwordOne, passwordTwo } = e.target.elements;
        if (passwordOne.value !== passwordTwo.value) {
            setPWMatch('Passwords do not match');
            return false;
        }
/*
        try {
            await doCreateUserWithEmailAndPassword(email.value, passwordOne.value, firstName.value, lastName.value, displayName.value);
        } catch (error) {
            alert(error);
        }*/
    };

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
