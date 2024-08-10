import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';
import redisClient from '../models/redisClient';

interface JwtPayload {
    id: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUser;
    }
}

/**
 * Middleware function to protect routes by verifying the authorization token.
 * If the token is valid, it sets the `req.user` property with the decoded user information and calls the `next` function.
 * If the token is invalid or missing, it sends a 401 response with an error message.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next function to call.
 */
export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const cachedToken = await redisClient.get(token);

            if (cachedToken) {
                req.user = JSON.parse(cachedToken) as IUser;
                next();
                return;
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!,
            ) as JwtPayload;

            req.user = (await User.findById(decoded.id).select('-password')) as
                | IUser
                | undefined;

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
