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
exports.userExists = exports.updateUserProfile = exports.createUser = exports.getUserByUsername = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
/**
 * Get all users.
 *
 * @returns A promise that resolves with an array of all users.
 */
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.find();
});
exports.getAllUsers = getAllUsers;
/**
 * Get a user by their ID.
 *
 * @param id - The ID of the user.
 * @returns A promise that resolves with the user if found, otherwise null.
 */
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        return yield user_1.default.findById(id);
    return null;
});
exports.getUserById = getUserById;
/**
 * Get a user by their email.
 *
 * @param email - The email of the user.
 * @returns A promise that resolves with the user if found, otherwise null.
 */
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email)
        return yield user_1.default.findOne({ email });
    return null;
});
exports.getUserByEmail = getUserByEmail;
/**
 * Get a user by their username.
 *
 * @param username - The username of the user.
 * @returns A promise that resolves with the user if found, otherwise null.
 */
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    if (!username)
        return yield user_1.default.findOne({ username });
    return null;
});
exports.getUserByUsername = getUserByUsername;
/**
 * Create a new user.
 *
 * @param name - The name of the user.
 * @param username - The username of the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves with the created user.
 */
const createUser = (name, username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new user_1.default({ name, username, email, password });
        return yield newUser.save();
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.createUser = createUser;
/**
 * Update a user's profile.
 *
 * @param id - The ID of the user.
 * @param name - The new name of the user.
 * @param username - The new username of the user.
 * @param email - The new email of the user.
 * @returns A promise that resolves with the updated user if successful, otherwise null.
 */
const updateUserProfile = (id, name, username, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(id);
    if (user) {
        user.name = name;
        user.username = username;
        user.email = email;
        return yield user.save();
    }
    return null;
});
exports.updateUserProfile = updateUserProfile;
/**
 * Check if a user exists.
 *
 * @param id - The ID of the user.
 * @returns A promise that resolves with a boolean indicating whether the user exists.
 * @throws None.
 */
const userExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return !!(yield user_1.default.findById(id));
});
exports.userExists = userExists;
