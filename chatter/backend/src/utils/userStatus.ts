import redisClient from '../config/redisClient';
/**
 * Updates the user status in Redis.
 *
 * @param userId - The ID of the user.
 * @param isOnline - A boolean indicating whether the user is online or offline.
 * @returns Promise<void>
 */
export const updateUserStatus = async (userId: string, isOnline: boolean) => {
    try {
        await redisClient.set(
            `userStatus:${userId}`,
            isOnline ? 'online' : 'offline',
        );
    } catch (error) {
        console.error('Failed to update user status in Redis:', error);
    }
};

/**
 * Retrieves the status of a user from Redis.
 * 
 * @param userId - The ID of the user.
 * @returns A boolean indicating whether the user is online or not. Returns false if an error occurs.
 */
export const getUserStatus = async (userId: string) => {
    try {
        const status = await redisClient.get(`userStatus:${userId}`);
        return status === 'online';
    } catch (error) {
        console.error('Failed to retrieve user status from Redis:', error);
        return false; // Default to offline if error occurs
    }
};
