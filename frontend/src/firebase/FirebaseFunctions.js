import firebase from 'firebase/app';

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

export { doSocialSignIn, doLogOut };
