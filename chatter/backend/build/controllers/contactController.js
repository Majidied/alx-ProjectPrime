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
exports.deleteContact = exports.getContactById = exports.getContactsForUser = exports.createContact = exports.sendContactRequest = void 0;
const TokenUtils_1 = require("../utils/TokenUtils");
const socketService_1 = require("../services/socketService");
const userService_1 = require("../services/userService");
const contactService_1 = require("../services/contactService");
/**
 * Send a contact request.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the result of the contact request.
 */
const sendContactRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const userId = yield (0, TokenUtils_1.getUserIdByToken)(token);
    if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    // should send a contact request to the recipient
    const { recipientId } = req.body;
    if (!recipientId) {
        return res.status(400).json({ error: 'Missing recipientId' });
    }
    try {
        const user = yield (0, userService_1.userExists)(recipientId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const recipientSocketId = yield (0, socketService_1.getUserSocketId)(recipientId);
        if (recipientSocketId && req.io) {
            req.io
                .to(recipientSocketId)
                .emit('contactRequest', { senderId: userId });
        }
        return res.status(201).json({ message: 'Contact request sent' });
    }
    catch (error) {
        console.error('Error sending contact request:', error);
        return res
            .status(500)
            .json({ error: 'Failed to send contact request' });
    }
});
exports.sendContactRequest = sendContactRequest;
/**
 * Add a new contact.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the created contact.
 */
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const userId = yield (0, TokenUtils_1.getUserIdByToken)(token);
    const { contactId } = req.body;
    if (!userId || !contactId) {
        return res.status(400).json({ error: 'Missing userId or contactId' });
    }
    try {
        const user = yield (0, userService_1.userExists)(contactId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const contact = yield (0, contactService_1.addContact)(userId, contactId);
        return res.status(201).json(contact);
    }
    catch (error) {
        console.error('Error creating contact:', error);
        return res.status(500).json({ error: 'Failed to create contact' });
    }
});
exports.createContact = createContact;
/**
 * Get all contacts for a user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the user's contacts.
 */
const getContactsForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const userId = yield (0, TokenUtils_1.getUserIdByToken)(token);
    if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const contacts = yield (0, contactService_1.getContacts)(userId);
        return res.status(200).json(contacts);
    }
    catch (error) {
        console.error('Error getting contacts:', error);
        return res.status(500).json({ error: 'Failed to get contacts' });
    }
});
exports.getContactsForUser = getContactsForUser;
/**
 * Get a contact by ID.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the contact details.
 */
const getContactById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const userId = yield (0, TokenUtils_1.getUserIdByToken)(token);
    const { contactId } = req.params;
    if (!userId || !contactId) {
        return res.status(400).json({ error: 'Missing userId or contactId' });
    }
    try {
        const contact = yield (0, contactService_1.getContact)(userId, contactId);
        return res.status(200).json(contact);
    }
    catch (error) {
        console.error('Error getting contact:', error);
        return res.status(500).json({ error: 'Failed to get contact' });
    }
});
exports.getContactById = getContactById;
/**
 * Remove a contact.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating success or failure.
 */
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const userId = yield (0, TokenUtils_1.getUserIdByToken)(token);
    const { contactId } = req.params;
    if (!userId || !contactId) {
        return res.status(400).json({ error: 'Missing userId or contactId' });
    }
    try {
        yield (0, contactService_1.removeContact)(userId, contactId);
        return res.status(200).json({ message: 'Contact removed' });
    }
    catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({ error: 'Failed to delete contact' });
    }
});
exports.deleteContact = deleteContact;
