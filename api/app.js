const express = require('express');
const app = express();

const configRoutes = require('./routes');
const { authentication } = require('./middleware');

const PORT = require('./config/settings.json').api.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: uncomment when authentication middleware is implemented
// app.use(authentication);

configRoutes(app);

app.listen(PORT, () => {
    console.log("We've now got a server!");
    console.log(`Your routes will be running on http://localhost:${PORT}`);
});

module.exports = app;
