import jwt from 'jsonwebtoken';
import redisClient from '../config/redisClient';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generates a token for the given user ID.
 *
 * @param id - The user ID.
 * @returns The generated token.
 */
const generateToken = (id: string, type: string) => {
    const token: string = jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d',
    });

    const DaysForExpiration: number = 30;

    redisClient.setEx(
        token.toString(),
        DaysForExpiration * 24 * 60 * 60,
        JSON.stringify({ id, type }),
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
        try {
            const parsedToken = JSON.parse(cachedToken);
            if (parsedToken && parsedToken.id) {
                return parsedToken.id;
            }
        } catch (error) {
            return cachedToken;
        }
    }
    return null;
};

/**
 * Removes all tokens associated with a specific user and type from the Redis cache.
 * 
 * @param userId - The ID of the user.
 * @param type - The type of the token.
 * @returns A Promise that resolves to void.
 * @throws If there is an error removing the tokens.
 */
const removeAllTokens = async (userId: string, type: string): Promise<void> => {
    try {
        const keys = await redisClient.keys('*');

        for (const key of keys) {
            const keyType = await redisClient.type(key);
            if (keyType !== 'string') {
                console.warn(`Skipping non-string key ${key} of type ${keyType}`);
                await redisClient.del(key);
                continue;
            }
            const cachedToken = await redisClient.get(key);

            if (cachedToken) {
                let shouldDelete = false;
                try {
                    const { id, type: tokenType } = JSON.parse(cachedToken);

                    if (id === userId && type === tokenType) {
                        shouldDelete = true;
                    }
                } catch (parseError) {
                    console.warn(`Skipping non-JSON value for key ${key}:`, cachedToken);
                    shouldDelete = true;
                }

                if (shouldDelete) {
                    const result = await redisClient.del(key);
                    if (result === 1) {
                        console.log(`Successfully deleted key: ${key}`);
                    } else {
                        console.warn(`Failed to delete key: ${key}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error removing tokens:', error);
    }
};


/**
 * Generates a verification token for a given user ID.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the generated verification token.
 */
const generateVerificationToken = async (userId: string): Promise<string> => {
    const verificationToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    // Store the token in Redis with a 1-hour expiration time
    await redisClient.setEx(verificationToken, 3600, userId);

    return verificationToken;
};

/**
 * Creates a transporter for sending emails.
 * 
 * @remarks
 * This function creates a nodemailer transporter using the provided configuration.
 * The transporter can be used to send emails using the Gmail service.
 * 
 * @returns The created transporter.
 */
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services or SMTP config
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends a verification email to the specified email address.
 * 
 * @param email - The email address to send the verification email to.
 * @param verificationUrl - The URL to include in the verification email.
 * @returns A promise that resolves when the email is sent successfully.
 */
const sendVerificationEmail = async (
    email: string,
    verificationUrl: string,
) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Verifies the validity of a token.
 * 
 * @param token - The token to be verified.
 * @returns A promise that resolves to the decoded token if it is valid, otherwise null.
 */
const verifyToken = async (token: string) => {
    const tokenCache = await redisClient.get(token);

    if (!tokenCache) {
        return null;
    }
    
    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });

    if (decoded) {
        return jwt.verify(token, process.env.JWT_SECRET!);
    }
    return null;
};

export {
    generateToken,
    removeToken,
    removeAllTokens,
    getUserIdByToken,
    generateVerificationToken,
    sendVerificationEmail,
    verifyToken,
};
