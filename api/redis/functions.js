const redisClient = require('./client');

async function getCachedData(dataKey) {
    const stringifyData = await redisClient.get(dataKey);
    return JSON.parse(stringifyData);
}

async function setCachedData(dataKey, data) {
    const stringifyData = JSON.stringify(data);
    await redisClient.set(dataKey, stringifyData);
}

module.exports = { getCachedData, setCachedData };
