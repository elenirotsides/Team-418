import firebase from 'firebase/app';

=======
>>>>>>> 949c20a8f82dc006437d38df804cd7f8a9753452
async function doSocialSignIn(provider) {
    let socialProvider = null;
    if (provider === 'google') {
        socialProvider = new firebase.auth.GoogleAuthProvider();
    }
    await firebase.auth().signInWithPopup(socialProvider);
}

async function doLogOut() {
    await firebase.auth().signOut();
}

<<<<<<< HEAD


export { doCreateUserWithEmailAndPassword, doSocialSignIn, doSignInWithEmailAndPassword, doPasswordReset, doLogOut, doChangePassword };
=======
export { doSocialSignIn, doLogOut };
>>>>>>> 949c20a8f82dc006437d38df804cd7f8a9753452
