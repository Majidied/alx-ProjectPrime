import { Request, Response } from 'express';
import { getUserByUsername, getUserById } from '../services/userService';
import { getUserStatus } from '../utils/userStatus';

/**
 * Searches for a user by username.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the user if found, or an error response
 * if not found or an error occurred.
 */
export const searchUser = async (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Missing username' });
    }

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        console.error('Error searching for user:', error);
        return res.status(500).json({ error: 'Failed to search for user' });
    }
};

/**
 * Gets a user by their ID.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the user if found, or an error response
 * if not found or an error occurred.
 */
export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Missing user ID' });
    }

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        console.error('Error getting user:', error);
        return res.status(500).json({ error: 'Failed to get user' });
    }
};

/**
 * Gets the status of a user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the user status.
 */
export const getUserStatusController = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Missing user ID' });
    }

    try {
        const isOnline = await getUserStatus(id);
        return res.status(200).json({ isOnline });
    } catch (error) {
        console.error('Error getting user status:', error);
        return res.status(500).json({ error: 'Failed to get user status' });
    }
};
