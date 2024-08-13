import { Request, Response } from 'express';
import { getUserByUsername } from '../services/userService';
import { getUserSocketId } from '../services/socketService';
import {
    createMessage,
    getMessagesBetweenUsers,
    markMessagesAsSeen,
    deleteMessagesBetweenUsers,
    deleteMessageById,
} from '../services/messageService';

import { Server } from 'socket.io';

interface CustomRequest extends Request {
    io?: Server;
}

/**
 * Send a new message.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the created message.
 */
export const sendMessage = async (req: CustomRequest, res: Response) => {
    const { senderId, recipientId, message } = req.body;

    if (!senderId || !recipientId || !message) {
        return res.status(400).json({ error: "Missing senderId, recipientId, or message" });
    }

    try {
        // Save the message to the database (assuming you have a Message model)
        const newMessage = await createMessage(senderId, recipientId, message);

        // Find the recipient's socketId
        const recipientUser = await getUserByUsername(recipientId);
        const recipientSocketId = recipientUser ? await getUserSocketId(recipientUser.id) : null;
        if (recipientUser && recipientSocketId && req.io) {
            // Emit the message to the recipient using Socket.IO
            req.io.to(recipientSocketId).emit("newMessage", {
                senderId,
                message,
                seen: false,
                timestamp: newMessage.timestamp,
            });
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Failed to send message" });
    }
};

/**
 * Get messages between two users.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the messages between the two users.
 */
export const getMessages = async (req: Request, res: Response) => {
    const { senderId, recipientId } = req.body;

    if (!senderId || !recipientId) {
        return res.status(400).json({ error: "Missing senderId or recipientId" });
    }

    try {
        // Retrieve messages between the two users
        const messages = await getMessagesBetweenUsers(senderId, recipientId);

        // Mark messages as seen
        await markMessagesAsSeen(senderId, recipientId);

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error getting messages:", error);
        return res.status(500).json({ error: "Failed to get messages" });
    }
}

/**
 * Delete messages between two users.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating success or failure.
 */
export const deleteMessages = async (req: Request, res: Response) => {
    const { senderId, recipientId } = req.body;

    if (!senderId || !recipientId) {
        return res.status(400).json({ error: "Missing senderId or recipientId" });
    }

    try {
        // Delete messages between the two users
        await deleteMessagesBetweenUsers(senderId, recipientId);

        return res.status(200).json({ message: "Messages deleted" });
    } catch (error) {
        console.error("Error deleting messages:", error);
        return res.status(500).json({ error: "Failed to delete messages" });
    }
}

/**
 * Delete a message by its ID.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating success or failure.
 */
export const deleteMessage = async (req: Request, res: Response) => {
    const { messageId } = req.body;

    if (!messageId) {
        return res.status(400).json({ error: "Missing messageId" });
    }

    try {
        // Delete the message by its ID
        await deleteMessageById(messageId);

        return res.status(200).json({ message: "Message deleted" });
    } catch (error) {
        console.error("Error deleting message:", error);
        return res.status(500).json({ error: "Failed to delete message" });
    }
}
