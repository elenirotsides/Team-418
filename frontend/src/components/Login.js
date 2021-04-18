import React, { useContext } from 'react';
import '../App.css';
import GoogleLogIn from './GoogleLogIn';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase/FirebaseFunctions';

function Login() {
    const { currentUser } = useContext(AuthContext);
    const handleLogin = async (event) => {
        event.preventDefault();
        let { email, password } = event.target.elements;

        try {
            await doSignInWithEmailAndPassword(email.value, password.value);
        } catch (error) {
            alert(error);
        }
    };

    const passwordReset = (event) => {
        event.preventDefault();
        let email = document.getElementById('email').value;
        if (email) {
            doPasswordReset(email);
            alert('Password email sent');
        } else {
            alert('Please enter an email address below before you click the forgot password link!');
        }
    };

    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <div className="text-center">
            <h1>Log in</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>
                        Email:
                        <input className="form-control" name="email" id="email" type="email" placeholder="Email" required />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Password:
                        <input className="form-control" name="password" type="password" placeholder="Password" required />
                    </label>
                </div>
                <button type="submit">Log in</button>

                <button onClick={passwordReset}>Forgot Password</button>
            </form>

            <br />
            <GoogleLogIn />
        </div>
    );
}

export default Login;
