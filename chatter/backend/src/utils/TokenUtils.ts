import jwt from 'jsonwebtoken';
import redisClient from '../models/redisClient';

/**
 * Generates a token for the given user ID.
 *
 * @param id - The user ID.
 * @returns The generated token.
 */
const generateToken = (id: string) => {
    const token: string = jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d',
    });

    const DaysForExpiration: number = 30;

    redisClient.setEx(
        token,
        DaysForExpiration * 24 * 60 * 60,
        JSON.stringify({ id }),
    );

    return token;
};

/**
 * Removes a token from the Redis cache and executes a callback function.
 *
 * @param {string} token - The token to be removed from the Redis cache.
 * @param {CallableFunction} func - The callback function to be executed after removing the token.
 * @returns {void}
 */
const removeToken = (token: string, func: CallableFunction) => {
    redisClient.del(token);
    func();
};

/**
 * Retrieves the user ID associated with a given token.
 *
 * @param {string} token - The token to retrieve the user ID from.
 * @returns {Promise<string|null>} - A promise that resolves to the user ID if the token is valid, or null if the token is not found.
 */
const getUserIdByToken = async (token: string) => {
    const cachedToken = await redisClient.get(token);
    if (cachedToken) {
        return JSON.parse(cachedToken).id;
    }
    return null;
};

export { generateToken, removeToken, getUserIdByToken };
