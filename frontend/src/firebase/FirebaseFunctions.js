import firebase from 'firebase/app';
import firebaseApp from './Firebase';

async function doSocialSignIn(provider) {
    let socialProvider = null;
    if (provider === 'google') {
        socialProvider = new firebase.auth.GoogleAuthProvider();
    }
    await firebase.auth().signInWithPopup(socialProvider);

    // after successful login create this user on the api if they don't exist
    const idToken = await firebaseApp.auth().currentUser.getIdToken();
    try {
        await fetch(`http://localhost:5000/users/create?idToken=${idToken}`, {
            method: 'POST',
        });
    } catch (e) {
        console.log('Failed request to POST /users/create', e);
    }
}

async function doLogOut() {
    await firebase.auth().signOut();
}

async function getUserIdToken() {
    try {
        return await firebaseApp.auth().currentUser.getIdToken();
    } catch {
        return null;
    }
}

export { doSocialSignIn, doLogOut, getUserIdToken };
