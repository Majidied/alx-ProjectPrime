import { createClient } from 'redis';

/**
 * Redis client for connecting to a Redis server.
 */
const redisClient = createClient({
    url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

redisClient.on('connect', () => {
    console.log('Redis connected');
});

redisClient.connect().catch(console.error);

export default redisClient;
