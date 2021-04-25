import React, { useContext, useState } from 'react';
import '../App.css';
import { Redirect } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
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

        try {
            await doCreateUserWithEmailAndPassword(email.value, passwordOne.value, firstName.value, lastName.value, displayName.value);
        } catch (error) {
            alert(error);
        }
    };

    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <div className="text-center">
            <h1>Sign up</h1>
            {pwMatch && <h4 className="error">{pwMatch}</h4>}
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label>
                        First Name:
                        <input className="form-control" required name="firstName" type="text" placeholder="First Name" />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Last Name:
                        <input className="form-control" required name="lastName" type="text" placeholder="Last Name" />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Display Name:
                        <input className="form-control" required name="displayName" type="text" placeholder="Display Name" />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Email:
                        <input className="form-control" required name="email" type="email" placeholder="Email" />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Password:
                        <input className="form-control" id="passwordOne" name="passwordOne" type="password" placeholder="Password" required />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Confirm Password:
                        <input className="form-control" name="passwordTwo" type="password" placeholder="Confirm Password" required />
                    </label>
                </div>
                <button id="submitButton" name="submitButton" type="submit">
                    Sign Up
                </button>
            </form>
            <br />
            <GoogleLogIn />
        </div>
    );
}

export default SignUp;
