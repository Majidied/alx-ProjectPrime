import User, { IUser } from '../models/user';

/**
 * Get all users.
 *
 * @returns A promise that resolves with an array of all users.
 */
export const getAllUsers = async (): Promise<IUser[]> => {
    return await User.find();
};

/**
 * Get a user by their ID.
 *
 * @param id - The ID of the user.
 * @returns A promise that resolves with the user if found, otherwise null.
 */
export const getUserById = async (id: string): Promise<IUser | null> => {
    if (id) return await User.findById(id);
    return null;
};

/**
 * Get a user by their email.
 *
 * @param email - The email of the user.
 * @returns A promise that resolves with the user if found, otherwise null.
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    if (email) return await User.findOne({ email });
    return null;
};

/**
 * Get a user by their username.
 *
 * @param username - The username of the user.
 * @returns A promise that resolves with the user if found, otherwise null.
 */
export const getUserByUsername = async (
    username: string,
): Promise<IUser | null> => {
    if (username) return await User.findOne({ username });
    return null;
};

/**
 * Create a new user.
 *
 * @param name - The name of the user.
 * @param username - The username of the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves with the created user.
 */

export const createUser = async (
    name: string,
    username: string,
    email: string,
    password: string,
): Promise<IUser> => {
    try {
        const newUser = new User({ name, username, email, password });
        return await newUser.save();
    } catch (err) {
        throw new Error(err as string);
    }
};

/**
 * Update a user's profile.
 *
 * @param id - The ID of the user.
 * @param name - The new name of the user.
 * @param username - The new username of the user.
 * @param email - The new email of the user.
 * @returns A promise that resolves with the updated user if successful, otherwise null.
 */

export const updateUserProfile = async (
    id: string,
    name: string,
    username: string,
    email: string,
): Promise<IUser | null> => {
    const user = await User.findById(id);
    if (user) {
        user.name = name;
        user.username = username;
        user.email = email;
        return await user.save();
    }
    return null;
};

/**
 * Check if a user exists.
 *
 * @param id - The ID of the user.
 * @returns A promise that resolves with a boolean indicating whether the user exists.
 * @throws None.
 */
export const userExists = async (id: string): Promise<boolean> => {
    return !!(await User.findById(id));
};
