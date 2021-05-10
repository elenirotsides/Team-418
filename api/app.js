const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const configRoutes = require('./routes');
const bodyParser = require('body-parser');
const { googleAuthentication } = require('./middleware');
const PORT = require('./config/settings.json').api.port;
const IGDBSessionHandler = require('./IGDB/IGDBSessionHandler');
const fileUpload = require('express-fileupload');

// Enable cors with authentication
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

//express config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Add Google authentication middleware
app.use(googleAuthentication);

// set up session cookie
app.use(
    session({
        name: 'Team418Cookie',
        secret: 'ps_er_jh_ip_zw',
        resave: false,
        saveUninitialized: true,
    })
);

IGDBSessionHandler.instance.checkRateLimit();

// TODO: uncomment when authentication middleware is implemented
// app.use(authentication);

configRoutes(app);

app.listen(PORT, () => {
    console.log("We've now got a server!");
    console.log(`Your routes will be running on http://localhost:${PORT}`);
});

module.exports = app;
