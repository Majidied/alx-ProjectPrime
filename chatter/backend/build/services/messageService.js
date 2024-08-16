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
exports.deleteMessageById = exports.deleteMessagesBetweenUsers = exports.markMessagesAsSeen = exports.getMessagesBetweenUsers = exports.createMessage = void 0;
const message_1 = __importDefault(require("../models/message"));
/**
 * Creates a new message and saves it to the database.
 *
 * @param senderId - The ID of the sender of the message.
 * @param recipientId - The ID of the recipient of the message.
 * @param message - The content of the message.
 * @param contactId - The ID of the contact associated with the message.
 * @returns A Promise that resolves to the created message.
 */
const createMessage = (senderId, recipientId, message, contactId) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = new message_1.default({ senderId, recipientId, message, contactId });
    return yield newMessage.save();
});
exports.createMessage = createMessage;
/**
 * Retrieves messages between users based on the provided contact ID.
 *
 * @param contactId - The ID of the contact.
 * @returns A promise that resolves to an array of messages.
 */
const getMessagesBetweenUsers = (contactId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield message_1.default.find({ contactId }).sort({ createdAt: 1 });
});
exports.getMessagesBetweenUsers = getMessagesBetweenUsers;
/**
 * Marks messages as seen.
 *
 * @param senderId - The ID of the sender.
 * @param recipientId - The ID of the recipient.
 * @returns A promise that resolves to void.
 */
const markMessagesAsSeen = (senderId, recipientId) => __awaiter(void 0, void 0, void 0, function* () {
    yield message_1.default.updateMany({ senderId, recipientId }, { seen: true });
});
exports.markMessagesAsSeen = markMessagesAsSeen;
/**
 * Deletes messages between two users.
 *
 * @param senderId - The ID of the sender user.
 * @param recipientId - The ID of the recipient user.
 * @returns A promise that resolves to void.
 */
const deleteMessagesBetweenUsers = (senderId, recipientId) => __awaiter(void 0, void 0, void 0, function* () {
    yield message_1.default.deleteMany({
        $or: [
            { senderId, recipientId },
            { senderId: recipientId, recipientId: senderId },
        ],
    });
});
exports.deleteMessagesBetweenUsers = deleteMessagesBetweenUsers;
/**
 * Deletes a message by its ID.
 *
 * @param messageId - The ID of the message to be deleted.
 * @returns A promise that resolves to void.
 */
const deleteMessageById = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    yield message_1.default.findByIdAndDelete(messageId);
});
exports.deleteMessageById = deleteMessageById;
