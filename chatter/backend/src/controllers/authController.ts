import { Request, Response } from 'express';
import User from '../models/user';
import {
    generateToken,
    getUserIdByToken,
    removeToken,
} from '../utils/TokenUtils';

/**
 * Registers a new user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the registered user's information and a token.
 */
export const registerUser = async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        res.status(400).json({ message: 'Please fill in all fields' });
        return;
    }

    const userEmailExists = await User.findOne({ email });

    if (userEmailExists) {
        res.status(400).json({ error: 'User already exists' });
        return;
    }

    const userUsernameExists = await User.findOne({ username });

    if (userUsernameExists) {
        res.status(400).json({ error: 'Username already exists' });
        return;
    }

    const user = await User.create({
        name,
        username,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            name: user.name,
            username: user.username,
            email: user.email,
            token: generateToken(user._id as unknown as string),
        });
    } else {
        res.status(400).json({ error: 'Invalid user data' });
    }
};

/**
 * Authenticates a user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the user's name, username, email, and token if authentication is successful. Otherwise, returns a JSON response with an error message.
 */
export const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            name: user.name,
            username: user.username,
            email: user.email,
            token: generateToken(user._id as unknown as string),
        });
    } else {
        res.status(401).json({ error: 'Invalid email or password' });
    }
};

/**
 * Retrieves the user profile based on the provided authorization token.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the user's profile information if the user is found,
 *          otherwise returns an error response.
 * @throws None.
 * @example
 * getUserProfile(req, res);
 */
export const getUserProfile = async (req: Request, res: Response) => {
    const userId = await getUserIdByToken(
        req.headers.authorization?.split(' ')[1] as string,
    );
    if (userId) {
        const user = await User.findById(userId);

        if (user) {
            res.json({
                name: user.name,
                username: user.username,
                email: user.email,
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

/**
 * Logs out a user by removing their token from Redis.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating the success or failure of the logout operation.
 */
export const logoutUser = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        // Remove the token from Redis
        new Promise((resolve) => {
            removeToken(token, resolve);
        }).then(() => {
            res.json({ message: 'Logged out successfully' });
        });
    } else {
        res.status(400).json({ message: 'No token provided' });
    }
};
