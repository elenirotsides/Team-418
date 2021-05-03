const redisClient = require('./client');

async function getCachedData(dataKey) {
    const stringifyData = await redisClient.get(dataKey);
    return JSON.parse(stringifyData);
}

async function setCachedData(dataKey, data, expiration = 0) {
    const stringifyData = JSON.stringify(data);
    await redisClient.set(dataKey, stringifyData);

    if (expiration > 0) {
        redisClient.expire(dataKey, expiration);
    }
}

module.exports = { getCachedData, setCachedData };
