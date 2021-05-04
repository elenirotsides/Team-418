var admin = require('firebase-admin');
var serviceAccount = require('./googleInfo.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const noTokenError = 'Request did not contain Google authentication token.';

async function authenticateWithGoogle(req, res, next) {
    try {
        const idToken = req.query.idToken || req.body.idToken;
        if (idToken) {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            console.log(`Authenticated user: ${decodedToken.email}`);
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
