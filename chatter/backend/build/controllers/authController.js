"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationEmail = exports.ValidateUser = exports.logoutUser = exports.getUserProfile = exports.authUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const TokenUtils_1 = require("../utils/TokenUtils");
/**
 * Registers a new user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the registered user's information and a token.
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        res.status(400).json({ message: 'Please fill in all fields' });
        return;
    }
    const userEmailExists = yield user_1.default.findOne({ email });
    if (userEmailExists) {
        res.status(400).json({ error: 'User already exists' });
        return;
    }
    const userUsernameExists = yield user_1.default.findOne({ username });
    if (userUsernameExists) {
        res.status(400).json({ error: 'Username already exists' });
        return;
    }
    const user = yield user_1.default.create({
        name,
        username,
        email,
        password,
        verified: false,
    });
    if (user) {
        const verificationToken = yield (0, TokenUtils_1.generateVerificationToken)(user.id);
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${verificationToken}`;
        yield (0, TokenUtils_1.sendVerificationEmail)(email, verificationUrl)
            .then(() => {
            console.log('Verification email sent');
        })
            .catch((error) => {
            user_1.default.deleteOne({ _id: user._id });
            res.status(500).json({
                error: 'Error sending verification email',
            });
        });
        res.status(201).json({
            name: user.name,
            username: user.username,
            email: user.email,
            token: (0, TokenUtils_1.generateToken)(user._id, 'auth'),
            message: 'User registered successfully, Please verify your email to confirm registration',
        });
    }
    else {
        res.status(400).json({ error: 'Invalid user data' });
    }
});
exports.registerUser = registerUser;
/**
 * Authenticates a user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the user's name, username, email,
 * and token if authentication is successful. Otherwise,
 * returns a JSON response with an error message.
 */
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (user && (yield user.matchPassword(password))) {
        if (user.verified) {
            res.status(200).json({
                message: 'User logged in successfully',
                name: user.name,
                username: user.username,
                email: user.email,
                token: (0, TokenUtils_1.generateToken)(user._id, 'auth'),
            });
        }
        else {
            res.status(400).json({
                message: 'User not verified',
                error: 'Please verify your email to login',
                token: (0, TokenUtils_1.generateToken)(user._id, 'verification'),
            });
        }
    }
    else {
        res.status(401).json({ error: 'Invalid email or password' });
    }
});
exports.authUser = authUser;
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
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = yield (0, TokenUtils_1.getUserIdByToken)((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (userId) {
        const user = yield user_1.default.findById(userId);
        if (user) {
            res.json({
                name: user.name,
                username: user.username,
                email: user.email,
            });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});
exports.getUserProfile = getUserProfile;
/**
 * Logs out a user by removing their token from Redis.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating the success or failure of the logout operation.
 */
const logoutUser = (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        // Remove the token from Redis
        new Promise((resolve) => {
            (0, TokenUtils_1.removeToken)(token, resolve);
        }).then(() => {
            res.json({ message: 'Logged out successfully' });
        });
    }
    else {
        res.status(400).json({ message: 'No token provided' });
    }
};
exports.logoutUser = logoutUser;
/**
 * Validates a user based on the provided token.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating whether the user was successfully
 * verified or if the token is invalid.
 */
const ValidateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }
        const tokenCache = yield (0, TokenUtils_1.verifyToken)(token);
        if (tokenCache) {
            const userId = yield (0, TokenUtils_1.getUserIdByToken)(token);
            if (!userId) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }
            const user = yield user_1.default.findById(userId);
            if (user) {
                user.verified = true;
                yield user.save();
                yield (0, TokenUtils_1.removeToken)(token, () => { });
                return res
                    .status(200)
                    .json({ message: 'User verified successfully' });
            }
            else {
                return res.status(404).json({ message: 'User not found' });
            }
        }
        else {
            return res
                .status(400)
                .json({ message: 'Invalid or expired token' });
        }
    }
    catch (error) {
        console.error('Error validating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.ValidateUser = ValidateUser;
/**
 * Resends a verification email to the user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating the status of the operation.
 */
const resendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Get userId from token
        const userId = yield (0, TokenUtils_1.getUserIdByToken)(token);
        if (!userId) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.verified) {
            return res
                .status(400)
                .json({ message: 'User is already verified' });
        }
        // Invalidate any existing tokens for this user
        yield (0, TokenUtils_1.removeAllTokens)(userId, 'verification').catch(console.error);
        // Generate a new verification token
        const newToken = (0, TokenUtils_1.generateToken)(userId, 'verification');
        // Send the verification email
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${newToken}`;
        yield (0, TokenUtils_1.sendVerificationEmail)(user.email, verificationUrl);
        return res
            .status(200)
            .json({ message: 'Verification email resent successfully' });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: 'Internal Server Error', error });
    }
});
exports.resendVerificationEmail = resendVerificationEmail;
