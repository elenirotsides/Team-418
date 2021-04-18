import React from 'react';
import { doSocialSignIn } from '../firebase/FirebaseFunctions';

const GoogleLogIn = () => {
    const socialSignOn = async (provider) => {
        try {
            await doSocialSignIn(provider);
        } catch (error) {
            alert(error);
        }
    };
    return (
        <div>
            <img className="google" onClick={() => socialSignOn('google')} alt="google signin" src="/imgs/btn_google_signin.png" />
        </div>
    );
};

export default GoogleLogIn;
