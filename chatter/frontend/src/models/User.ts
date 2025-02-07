/**
 * Interface representing a User object.
 */
export interface User {
    _id: string;           // Unique identifier for the user
    name: string;          // Full name of the user
    username: string;      // Username of the user
    email: string;         // Email address of the user
    password: string;      // User's password (should be hashed in the database)
    verified: boolean;     // Indicates whether the user's email is verified
}
