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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.deleteMessages = exports.getMessages = exports.sendMessage = void 0;
const userService_1 = require("../services/userService");
const socketService_1 = require("../services/socketService");
const messageService_1 = require("../services/messageService");
/**
 * Send a new message.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the created message.
 */
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, recipientId, message, contactId } = req.body;
    if (!senderId || !recipientId || !message || !contactId) {
        return res
            .status(400)
            .json({
            error: 'Missing senderId, recipientId, message, or contactId',
        });
    }
    try {
        // Save the message to the database (assuming you have a Message model)
        const newMessage = yield (0, messageService_1.createMessage)(senderId, recipientId, message, contactId);
        // Find the recipient's socketId
        const recipientUser = yield (0, userService_1.getUserByUsername)(recipientId);
        const recipientSocketId = recipientUser
            ? yield (0, socketService_1.getUserSocketId)(recipientUser.id)
            : null;
        if (recipientUser && recipientSocketId && req.io) {
            // Emit the message to the recipient using Socket.IO
            req.io.to(recipientSocketId).emit('newMessage', {
                senderId,
                message,
                seen: false,
                timestamp: newMessage.timestamp,
            });
        }
        return res.status(201).json(newMessage);
    }
    catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
});
exports.sendMessage = sendMessage;
/**
 * Get messages between two users.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the messages between the two users.
 */
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId } = req.params;
    if (!contactId) {
        return res.status(400).json({ error: 'Missing contactId' });
    }
    try {
        // Get messages between the two users
        const messages = yield (0, messageService_1.getMessagesBetweenUsers)(contactId);
        // Get the sender and recipient IDs
        const senderId = messages.length > 0 ? messages[0].senderId : null;
        const recipientId = messages.length > 0 ? messages[0].recipientId : null;
        if (!senderId || !recipientId) {
            return res
                .status(400)
                .json({ error: 'Invalid senderId or recipientId' });
        }
        // Mark messages as seen
        yield (0, messageService_1.markMessagesAsSeen)(senderId, recipientId);
        return res.status(200).json(messages);
    }
    catch (error) {
        console.error('Error getting messages:', error);
        return res.status(500).json({ error: 'Failed to get messages' });
    }
});
exports.getMessages = getMessages;
/**
 * Delete messages between two users.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating success or failure.
 */
const deleteMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, recipientId } = req.body;
    if (!senderId || !recipientId) {
        return res
            .status(400)
            .json({ error: 'Missing senderId or recipientId' });
    }
    try {
        // Delete messages between the two users
        yield (0, messageService_1.deleteMessagesBetweenUsers)(senderId, recipientId);
        return res.status(200).json({ message: 'Messages deleted' });
    }
    catch (error) {
        console.error('Error deleting messages:', error);
        return res.status(500).json({ error: 'Failed to delete messages' });
    }
});
exports.deleteMessages = deleteMessages;
/**
 * Delete a message by its ID.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating success or failure.
 */
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.body;
    if (!messageId) {
        return res.status(400).json({ error: 'Missing messageId' });
    }
    try {
        // Delete the message by its ID
        yield (0, messageService_1.deleteMessageById)(messageId);
        return res.status(200).json({ message: 'Message deleted' });
    }
    catch (error) {
        console.error('Error deleting message:', error);
        return res.status(500).json({ error: 'Failed to delete message' });
    }
});
exports.deleteMessage = deleteMessage;
