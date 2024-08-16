import { Request } from "express";
import { getUserIdByToken } from "./TokenUtils";

/**
 * Retrieves the identifier from the request object.
 * The identifier can be either the "x-message-id" header or the user ID
 * obtained from the authorization token.
 * If neither is available, null is returned.
 * 
 * @param req - The request object.
 * @returns The identifier (message ID or user ID) or null if not found.
 */
export const getIdentifier = async (req: Request) => {
  const messageId = req.headers["x-message-id"];

    if (messageId) {
        return messageId;
    }

    const userId = await getUserIdByToken(
        req.headers.authorization?.split(' ')[1] as string,
    );

    if (userId) {
        return userId;
    }

    return null;
};

