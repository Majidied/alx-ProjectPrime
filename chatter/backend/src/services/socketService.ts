import redisClient from "../config/redisClient";

/**
 * Stores the socket ID for a user in Redis.
 * 
 * @param userId - The ID of the user.
 * @param socketId - The socket ID to be stored.
 * @throws {Error} If there is an error storing the user socket ID in Redis.
 */
const storeUserSocketId = async (
  userId: string,
  socketId: string
): Promise<void> => {
  try {
    // Store the socket ID in Redis hash under the key 'users'
    await redisClient.hSet("users", userId, socketId);
    console.log(`Stored socket ID ${socketId} for user ${userId}`);
  } catch (error) {
    throw new Error("Error storing user socket ID in Redis: " + error);
  }
};

/**
 * Retrieves the socket ID associated with a user ID from Redis.
 * 
 * @param userId - The ID of the user.
 * @returns A Promise that resolves to the socket ID if found, or null if not found.
 * @throws An error if there was an issue retrieving the socket ID from Redis.
 */
const getUserSocketId = async (userId: string): Promise<string | null> => {
  try {
    // Retrieve the socket ID from Redis hash under the key 'users'
    const socketId = await redisClient.hGet("users", userId);
    if (socketId) return socketId;
    else return null;
  } catch (error) {
    throw new Error("Error getting user socket ID from Redis: " + error);
  }
};

/**
 * Deletes the socket ID associated with the given user ID from Redis.
 * 
 * @param userId - The ID of the user whose socket ID needs to be deleted.
 * @returns A Promise that resolves to void.
 * @throws An error if there is an issue deleting the user socket ID from Redis.
 */
const deleteUserSocketId = async (userId: string): Promise<void> => {
  try {
    // Delete the socket ID from Redis hash under the key 'users'
    await redisClient.hDel("users", userId);
  } catch (error) {
    throw new Error("Error deleting user socket ID from Redis: " + error);
  }
};

export { storeUserSocketId, getUserSocketId, deleteUserSocketId };
