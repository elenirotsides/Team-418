import firebase from 'firebase/app';
import axios from 'axios';

async function doCreateUserWithEmailAndPassword(email, password, firstName, lastName, displayName) {

  //Syntax from https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/
    /*axios.post('http://localhost:3000/signup', {
        firstName: firstName,
        lastName: lastName,
        displayName: displayName,
        email: email
      })
      .then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });*/

    await firebase.auth().createUserWithEmailAndPassword(email, password);
    firebase.auth().currentUser.updateProfile({ firstName: firstName, lastName: lastName });
}

async function doChangePassword(email, oldPassword, newPassword) {
    let credential = firebase.auth.EmailAuthProvider.credential(email, oldPassword);
    await firebase.auth().currentUser.reauthenticateWithCredential(credential);
    await firebase.auth().currentUser.updatePassword(newPassword);
    await doLogOut();
}

async function doSignInWithEmailAndPassword(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function doSocialSignIn(provider) {
    let socialProvider = null;
    if (provider === 'google') {
        socialProvider = new firebase.auth.GoogleAuthProvider();
    }
    await firebase.auth().signInWithPopup(socialProvider);
}

async function doPasswordReset(email) {
    await firebase.auth().sendPasswordResetEmail(email);
}

async function doLogOut() {
    await firebase.auth().signOut();
}



export { doCreateUserWithEmailAndPassword, doSocialSignIn, doSignInWithEmailAndPassword, doPasswordReset, doLogOut, doChangePassword };
