import { Request, Response } from 'express';
import User from '../models/user';
import {
    generateToken,
    getUserIdByToken,
    removeToken,
    generateVerificationToken,
    sendVerificationEmail,
    verifyToken,
    removeAllTokens,
} from '../utils/TokenUtils';
import { Server } from 'socket.io';

interface CustomRequest extends Request {
    io?: Server;
}

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
        res.status(400).json({ error: 'Please fill in all fields' });
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
        verified: false,
    });

    if (user) {
        const verificationToken = await generateVerificationToken(user.id);

        const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${verificationToken}`;

        await sendVerificationEmail(email, verificationUrl)
            .then(() => {
                console.log('Verification email sent');
            })
            .catch((error) => {
                User.deleteOne({ _id: user._id });
                res.status(500).json({
                    error: 'Error sending verification email',
                });
            });

        res.status(201).json({
            token: generateToken(user._id as unknown as string, 'auth'),
            message:
                'User registered successfully, Please verify your email to confirm registration',
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
 * @returns A JSON response containing the user's name, username, email,
 * and token if authentication is successful. Otherwise,
 * returns a JSON response with an error message.
 */
export const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            message: 'User logged in successfully',
            name: user.name,
            username: user.username,
            email: user.email,
            token: generateToken(user._id as unknown as string, 'auth'),
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
                _id: user._id,
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

/**
 * Validates a user based on the provided token.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating whether the user was successfully
 * verified or if the token is invalid.
 */
export const ValidateUser = async (req: CustomRequest, res: Response) => {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        const tokenCache = await verifyToken(token);
        if (!tokenCache) {
            return res
                .status(400)
                .json({ message: 'Invalid or expired token' });
        }

        const userId = await getUserIdByToken(token);
        if (!userId) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.verified = true;
        await user.save();

        if (req.io) {
            req.io.emit('user-verified', { userId: user._id });
        }

        removeAllTokens(userId, 'verification').catch(console.error);

        res.status(200).redirect('http://localhost:3000/chat');
    } catch (error) {
        console.error('Error validating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Resends a verification email to the user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating the status of the operation.
 */
export const resendVerificationEmail = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Get userId from token
        const userId = await getUserIdByToken(token);

        if (!userId) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verified) {
            return res
                .status(400)
                .json({ message: 'User is already verified' });
        }

        // Invalidate any existing tokens for this user
        await removeAllTokens(userId, 'verification').catch(console.error);

        // Generate a new verification token
        const newToken = generateToken(userId, 'verification');

        // Send the verification email
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${newToken}`;
        await sendVerificationEmail(user.email, verificationUrl);

        return res
            .status(200)
            .json({ message: 'Verification email resent successfully' });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error', error });
    }
};

/**
 * Checks if the user is verified.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating whether the user is verified or not.
 */
export const isVerifiedUser = async (req: Request, res: Response) => {
    const userId = await getUserIdByToken(
        req.headers.authorization?.split(' ')[1] as string,
    );
    if (userId) {
        const user = await User.findById(userId);

        if (user) {
            res.json({
                isVerified: user.verified,
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
