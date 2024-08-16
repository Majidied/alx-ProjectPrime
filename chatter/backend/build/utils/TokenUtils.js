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
exports.verifyToken = exports.sendVerificationEmail = exports.generateVerificationToken = exports.getUserIdByToken = exports.removeAllTokens = exports.removeToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redisClient_1 = __importDefault(require("../config/redisClient"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Generates a token for the given user ID.
 *
 * @param id - The user ID.
 * @returns The generated token.
 */
const generateToken = (id, type) => {
    const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    const DaysForExpiration = 30;
    redisClient_1.default.setEx(token.toString(), DaysForExpiration * 24 * 60 * 60, JSON.stringify({ id, type }));
    return token;
};
exports.generateToken = generateToken;
/**
 * Removes a token from the Redis cache and executes a callback function.
 *
 * @param {string} token - The token to be removed from the Redis cache.
 * @param {CallableFunction} func - The callback function to be executed after removing the token.
 * @returns {void}
 */
const removeToken = (token, func) => {
    redisClient_1.default.del(token);
    func();
};
exports.removeToken = removeToken;
/**
 * Retrieves the user ID associated with a given token.
 *
 * @param {string} token - The token to retrieve the user ID from.
 * @returns {Promise<string|null>} - A promise that resolves to the user ID if the token is valid, or null if the token is not found.
 */
const getUserIdByToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedToken = yield redisClient_1.default.get(token);
    if (cachedToken) {
        return JSON.parse(cachedToken).id;
    }
    return null;
});
exports.getUserIdByToken = getUserIdByToken;
/**
 * Removes all tokens associated with a specific user and type from the Redis cache.
 *
 * @param userId - The ID of the user.
 * @param type - The type of the token.
 * @returns A Promise that resolves to void.
 * @throws If there is an error removing the tokens.
 */
const removeAllTokens = (userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keys = yield redisClient_1.default.keys('*');
        console.log(`Found ${keys.length} keys`);
        for (const key of keys) {
            console.log(`Processing key: ${key}`);
            const keyType = yield redisClient_1.default.type(key);
            if (keyType !== 'string') {
                console.warn(`Skipping non-string key ${key} of type ${keyType}`);
                yield redisClient_1.default.del(key);
                continue;
            }
            const cachedToken = yield redisClient_1.default.get(key);
            if (cachedToken) {
                let shouldDelete = false;
                try {
                    const { id, type: tokenType } = JSON.parse(cachedToken);
                    console.log(`Parsed token for key ${key}:`, { id, tokenType });
                    if (id === userId && type === tokenType) {
                        shouldDelete = true;
                    }
                }
                catch (parseError) {
                    console.warn(`Skipping non-JSON value for key ${key}:`, cachedToken);
                    shouldDelete = true;
                }
                if (shouldDelete) {
                    const result = yield redisClient_1.default.del(key);
                    if (result === 1) {
                        console.log(`Successfully deleted key: ${key}`);
                    }
                    else {
                        console.warn(`Failed to delete key: ${key}`);
                    }
                }
            }
        }
    }
    catch (error) {
        console.error('Error removing tokens:', error);
    }
});
exports.removeAllTokens = removeAllTokens;
/**
 * Generates a verification token for a given user ID.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the generated verification token.
 */
const generateVerificationToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    // Store the token in Redis with a 1-hour expiration time
    yield redisClient_1.default.setEx(verificationToken, 3600, userId);
    return verificationToken;
});
exports.generateVerificationToken = generateVerificationToken;
/**
 * Creates a transporter for sending emails.
 *
 * @remarks
 * This function creates a nodemailer transporter using the provided configuration.
 * The transporter can be used to send emails using the Gmail service.
 *
 * @returns The created transporter.
 */
const transporter = nodemailer_1.default.createTransport({
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
const sendVerificationEmail = (email, verificationUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendVerificationEmail = sendVerificationEmail;
/**
 * Verifies the validity of a token.
 *
 * @param token - The token to be verified.
 * @returns A promise that resolves to the decoded token if it is valid, otherwise null.
 */
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenCache = yield redisClient_1.default.get(token);
    if (!tokenCache) {
        return null;
    }
    const decoded = yield new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });
    });
    if (decoded) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    return null;
});
exports.verifyToken = verifyToken;
