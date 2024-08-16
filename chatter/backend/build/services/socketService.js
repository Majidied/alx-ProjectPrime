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
exports.deleteUserSocketId = exports.getUserSocketId = exports.storeUserSocketId = void 0;
const redisClient_1 = __importDefault(require("../config/redisClient"));
/**
 * Stores the socket ID for a user in Redis.
 *
 * @param userId - The ID of the user.
 * @param socketId - The socket ID to be stored.
 * @throws {Error} If there is an error storing the user socket ID in Redis.
 */
const storeUserSocketId = (userId, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Store the socket ID in Redis hash under the key 'users'
        yield redisClient_1.default.hSet("users", userId, socketId);
        console.log(`Stored socket ID ${socketId} for user ${userId}`);
    }
    catch (error) {
        throw new Error("Error storing user socket ID in Redis: " + error);
    }
});
exports.storeUserSocketId = storeUserSocketId;
/**
 * Retrieves the socket ID associated with a user ID from Redis.
 *
 * @param userId - The ID of the user.
 * @returns A Promise that resolves to the socket ID if found, or null if not found.
 * @throws An error if there was an issue retrieving the socket ID from Redis.
 */
const getUserSocketId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve the socket ID from Redis hash under the key 'users'
        const socketId = yield redisClient_1.default.hGet("users", userId);
        if (socketId)
            return socketId;
        else
            return null;
    }
    catch (error) {
        throw new Error("Error getting user socket ID from Redis: " + error);
    }
});
exports.getUserSocketId = getUserSocketId;
/**
 * Deletes the socket ID associated with the given user ID from Redis.
 *
 * @param userId - The ID of the user whose socket ID needs to be deleted.
 * @returns A Promise that resolves to void.
 * @throws An error if there is an issue deleting the user socket ID from Redis.
 */
const deleteUserSocketId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete the socket ID from Redis hash under the key 'users'
        yield redisClient_1.default.hDel("users", userId);
    }
    catch (error) {
        throw new Error("Error deleting user socket ID from Redis: " + error);
    }
});
exports.deleteUserSocketId = deleteUserSocketId;
