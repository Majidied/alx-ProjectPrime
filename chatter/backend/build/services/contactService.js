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
exports.removeContact = exports.getContacts = exports.getContact = exports.addContact = void 0;
const contact_1 = __importDefault(require("../models/contact"));
/**
 * Adds a new contact.
 *
 * @param userId - The ID of the user.
 * @param contactId - The ID of the contact.
 * @returns A promise that resolves with the created contact.
 */
const addContact = (userId, contactId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !contactId) {
        throw new Error("User ID and contact ID are required");
    }
    if (userId === contactId) {
        throw new Error("Cannot add self as contact");
    }
    const existingContact = yield (0, exports.getContact)(userId, contactId);
    if (existingContact) {
        throw new Error("Contact already exists");
    }
    // sort the IDs to ensure consistency
    const [id1, id2] = [userId, contactId].sort();
    const newContact = new contact_1.default({ userId: id1, contactId: id2 });
    return yield newContact.save();
});
exports.addContact = addContact;
/**
 * Retrieves a contact by user ID and contact ID.
 *
 * @param userId - The ID of the user.
 * @param contactId - The ID of the contact.
 * @returns A promise that resolves with the contact if found, otherwise null.
 */
const getContact = (userId, contactId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !contactId) {
        throw new Error("User ID and contact ID are required");
    }
    const [id1, id2] = [userId, contactId].sort();
    return yield contact_1.default.findOne({ userId: id1, contactId: id2 });
});
exports.getContact = getContact;
/**
 * Retrieves all contacts for a user.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves with an array of contacts.
 */
const getContacts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error("User ID is required");
    }
    return yield contact_1.default.find({ userId });
});
exports.getContacts = getContacts;
/**
 * Removes a contact.
 *
 * @param userId - The ID of the user.
 * @param contactId - The ID of the contact.
 * @returns A promise that resolves to void.
 */
const removeContact = (userId, contactId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !contactId) {
        throw new Error("User ID and contact ID are required");
    }
    const [id1, id2] = [userId, contactId].sort();
    yield contact_1.default.deleteOne({ userId: id1, contactId: id2 });
});
exports.removeContact = removeContact;
