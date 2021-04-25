import React, { useContext } from 'react';
import '../App.css';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import GoogleLogIn from './GoogleLogIn';

function SignUp() {
    const { currentUser } = useContext(AuthContext);
<<<<<<< HEAD
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
=======
>>>>>>> 949c20a8f82dc006437d38df804cd7f8a9753452

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
