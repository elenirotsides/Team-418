import firebase from 'firebase/app';
import firebaseApp from './Firebase';

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

async function getUserIdToken() {
    try {
        return await firebaseApp.auth().currentUser.getIdToken();
    } catch {
        return null;
    }
}

export { doSocialSignIn, doLogOut, getUserIdToken };
