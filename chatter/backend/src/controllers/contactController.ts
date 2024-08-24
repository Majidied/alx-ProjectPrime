import { Request, Response } from 'express';
import { getUserIdByToken } from '../utils/TokenUtils';
import { getUserSocketId } from '../services/socketService';
import { userExists } from '../services/userService';
import {
    addContact,
    getContacts,
    getContact,
    removeContact,
    contactExists,
} from '../services/contactService';
import {
    setContactRequest,
    getContactRequests,
    checkContactRequest,
    removeContactRequest,
} from '../utils/contactReqeust';

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

        const isContact = await contactExists(userId, recipientId);
        if (isContact) {
            return res.status(400).json({ error: 'User is already a contact' });
        }

        const contactRequestExists = await checkContactRequest(
            userId,
            recipientId,
        );
        if (contactRequestExists) {
            return res
                .status(400)
                .json({ error: 'Contact request already sent' });
        }

        await setContactRequest(userId, recipientId);
        const recipientSocketId = await getUserSocketId(recipientId);
        console.log('Recipient socket ID:', recipientSocketId);
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
 * Decline a contact request.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the result of the contact request.
 */
export const declineContactRequest = async (
    req: CustomRequest,
    res: Response,
) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await getUserIdByToken(token as string);

    if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { senderId } = req.params;

    if (!senderId) {
        return res.status(400).json({ error: 'Missing senderId' });
    }

    try {
        await removeContactRequest(senderId, userId);
        return res.status(200).json({ message: 'Contact request declined' });
    } catch (error) {
        console.error('Error declining contact request:', error);
        return res
            .status(500)
            .json({ error: 'Failed to decline contact request' });
    }
}

/**
 * Retrieves contact requests for a user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the contact requests or an error message.
 */
export const getContactRequestsForUser = async (
    req: Request,
    res: Response,
) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await getUserIdByToken(token as string);

    if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const contactRequests = await getContactRequests(userId);
        return res.status(200).json(contactRequests);
    } catch (error) {
        console.error('Error getting contact requests:', error);
        return res
            .status(500)
            .json({ error: 'Failed to get contact requests' });
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

        if (await contactExists(userId, contactId)) {
            return res.status(400).json({ error: 'Contact already exists' });
        }

        await removeContactRequest(contactId, userId);
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
