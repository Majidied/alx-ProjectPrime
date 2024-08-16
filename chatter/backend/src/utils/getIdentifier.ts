import { Request } from "express";
import { getUserIdByToken } from "./TokenUtils";

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

