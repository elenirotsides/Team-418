const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');
const mongoUrl = process.env.DOCKER_MODE
    ? settings.mongo.dockerServerUrl
    : settings.mongo.localServerUrl;
const mongoDatabase = settings.mongo.database;
console.log(`Connecting to database (${mongoDatabase}) at (${mongoUrl})`);
let _connection = undefined;
let _db = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        _db = await _connection.db(mongoDatabase);
    }

    return _db;
};
