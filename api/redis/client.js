const asyncRedis = require('async-redis');
const redisOptions = {
    host: process.env.DOCKER_MODE ? 'redis' : 'localhost',
    port: 6379,
};
const redisClient = asyncRedis.createClient(redisOptions);

async function clearCache() {
    console.log('Clearing the redis cache...');
    await redisClient.flushall();
}

async function testRedisConnection() {
    console.log(
        `Sending ping to redis server at host (${redisOptions.host}) on port (${redisOptions.port})...`
    );
    console.log(await redisClient.ping());
}

testRedisConnection();
clearCache();

module.exports = redisClient;
