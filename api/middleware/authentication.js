var admin = require('firebase-admin');

async function authenticateWithGoogle(req, res, next) {
    try {
        const idToken = req.idToken;
        if (idToken) {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;
            // some validation here
            next();
        } else {
            throw 'no id provided, returning 401 unauthorized';
        }
    } catch (e) {
        console.log(e);
        res.status(401).send();
    }
}

module.exports = {
    authenticateWithGoogle,
};
