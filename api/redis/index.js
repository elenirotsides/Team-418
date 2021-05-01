const redisClient = require('./client');
const { getCachedData, setCachedData } = require('./functions');
const dataKeys = require('./keys');

module.exports = { redisClient, getCachedData, setCachedData, dataKeys };
