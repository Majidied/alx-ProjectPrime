import redisClient from '../config/redisClient';

/**
 * Sets a contact request for a user.
 *
 * @param userId - The ID of the user sending the contact request.
 * @param contactId - The ID of the user receiving the contact request.
 * @returns A promise that resolves to void.
 * @throws An error if the contact request fails to be set.
 */
export const setContactRequest = async (
    userId: string,
    contactId: string,
): Promise<void> => {
    try {
        await redisClient.sAdd(contactId, userId);
        // Optionally, set an expiration for the set if you want it to expire after some time
        await redisClient.expire(contactId, 60 * 60 * 24 * 7); // 1 week
    } catch (error) {
        console.error('Failed to set contact request:', error);
        throw new Error('Failed to set contact request');
    }
};

/**
 * Removes a contact request for a user.
 *
 * @param userId - The ID of the user sending the contact request.
 * @param contactId - The ID of the user receiving the contact request.
 * @returns A promise that resolves to void.
 * @throws An error if the contact request fails to be removed.
 */
export const removeContactRequest = async (
    userId: string,
    contactId: string,
): Promise<void> => {
    try {
        await redisClient.sRem(contactId, userId);
    } catch (error) {
        console.error('Failed to remove contact request:', error);
        throw new Error('Failed to remove contact request');
    }
}

/**
 * Retrieves the contact requests for a given user.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of contact requests.
 * @throws If there is an error retrieving the contact requests.
 */
export const getContactRequests = async (userId: string): Promise<string[]> => {
    try {
        const contactRequests = await redisClient.sMembers(userId);
        return contactRequests;
    } catch (error) {
        console.error('Failed to get contact requests:', error);
        throw new Error('Failed to get contact requests');
    }
};

/**
 * Checks if a contact request exists between two users.
 *
 * @param userId - The ID of the user.
 * @param contactId - The ID of the contact.
 * @returns A Promise that resolves to a boolean indicating whether the contact request exists.
 * @throws An error if the contact request check fails.
 */
export const checkContactRequest = async (
    userId: string,
    contactId: string,
): Promise<boolean> => {
    try {
        const result = await redisClient.sIsMember(contactId, userId);
        return result;
    } catch (error) {
        console.error('Failed to check contact request:', error);
        throw new Error('Failed to check contact request');
    }
};
