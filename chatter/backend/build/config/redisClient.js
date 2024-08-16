"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
/**
 * Redis client for connecting to a Redis server.
 */
const redisClient = (0, redis_1.createClient)({
    url: 'redis://localhost:6379',
});
redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});
redisClient.on('connect', () => {
    console.log('Redis connected');
});
redisClient.connect().catch(console.error);
exports.default = redisClient;
