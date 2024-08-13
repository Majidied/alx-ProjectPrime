import { Request, Response } from 'express';
import { getUserIdByToken } from '../utils/TokenUtils';
import { getUserSocketId } from '../services/socketService';
import { userExists } from '../services/userService';
import {
    addContact,
    getContacts,
    getContact,
    removeContact,
} from '../services/contactService';

import { Server } from 'socket.io';

interface CustomRequest extends Request {
    io?: Server;
}

/**
 * Send a contact request.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the result of the contact request.
 */
export const sendContactRequest = async (req: CustomRequest, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await getUserIdByToken(token as string);

    if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    // should send a contact request to the recipient
    const { recipientId } = req.body;

    if (!recipientId) {
        return res.status(400).json({ error: 'Missing recipientId' });
    }

    try {
        const user = await userExists(recipientId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const recipientSocketId = await getUserSocketId(recipientId);
        if (recipientSocketId && req.io) {
            req.io
                .to(recipientSocketId)
                .emit('contactRequest', { senderId: userId });
        }

        return res.status(201).json({ message: 'Contact request sent' });
    } catch (error) {
        console.error('Error sending contact request:', error);
        return res
            .status(500)
            .json({ error: 'Failed to send contact request' });
    }
};

/**
 * Add a new contact.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the created contact.
 */
export const createContact = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await getUserIdByToken(token as string);
    const { contactId } = req.body;

    if (!userId || !contactId) {
        return res.status(400).json({ error: 'Missing userId or contactId' });
    }

    try {
        const user = await userExists(contactId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const contact = await addContact(userId, contactId);
        return res.status(201).json(contact);
    } catch (error) {
        console.error('Error creating contact:', error);
        return res.status(500).json({ error: 'Failed to create contact' });
    }
};

/**
 * Get all contacts for a user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the user's contacts.
 */
export const getContactsForUser = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await getUserIdByToken(token as string);

    if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const contacts = await getContacts(userId);
        return res.status(200).json(contacts);
    } catch (error) {
        console.error('Error getting contacts:', error);
        return res.status(500).json({ error: 'Failed to get contacts' });
    }
};

/**
 * Get a contact by ID.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the contact details.
 */
export const getContactById = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await getUserIdByToken(token as string);
    const { contactId } = req.params;

    if (!userId || !contactId) {
        return res.status(400).json({ error: 'Missing userId or contactId' });
    }

    try {
        const contact = await getContact(userId, contactId);
        return res.status(200).json(contact);
    } catch (error) {
        console.error('Error getting contact:', error);
        return res.status(500).json({ error: 'Failed to get contact' });
    }
};

/**
 * Remove a contact.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating success or failure.
 */
export const deleteContact = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await getUserIdByToken(token as string);
    const { contactId } = req.params;

    if (!userId || !contactId) {
        return res.status(400).json({ error: 'Missing userId or contactId' });
    }

    try {
        await removeContact(userId, contactId);
        return res.status(200).json({ message: 'Contact removed' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({ error: 'Failed to delete contact' });
    }
};
