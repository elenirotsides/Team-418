var admin = require('firebase-admin');
let serviceAccount;
try {
    serviceAccount = require('./googleInfo.json');
} catch {
    throw 'You must have the Google service account info at api/middleware/googleInfo.json';
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const noTokenError = 'Request did not contain Google authentication token.';

async function authenticateWithGoogle(req, res, next) {
    try {
        const idToken =
            (req.query && req.query.idToken) || (req.body && req.body.idToken);
        if (idToken) {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.googleInfo = decodedToken;
            next();
        } else {
            console.log(noTokenError);
            res.status(401).json({
                error: noTokenError,
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({
            error:
                'There was an error authenticating your account with Google.',
        });
    }
}

module.exports = authenticateWithGoogle;
