import Contact, { IContact } from '../models/contact';

/**
 * Adds a new contact.
 *
 * @param userId - The ID of the user.
 * @param contactId - The ID of the contact.
 * @returns A promise that resolves with the created contact.
 */
export const addContact = async (
    userId: string,
    contactId: string,
): Promise<IContact> => {
    if (!userId || !contactId) {
        throw new Error("User ID and contact ID are required");
    }

    if (userId === contactId) {
        throw new Error("Cannot add self as contact");
    }

    const existingContact = await getContact(userId, contactId);
    if (existingContact) {
        throw new Error("Contact already exists");
    }
    // sort the IDs to ensure consistency
    const [id1, id2] = [userId, contactId].sort();
    const newContact = new Contact({ userId: id1, contactId: id2 });
    return await newContact.save();
};

/**
 * Retrieves a contact by user ID and contact ID.
 *
 * @param userId - The ID of the user.
 * @param contactId - The ID of the contact.
 * @returns A promise that resolves with the contact if found, otherwise null.
 */
export const getContact = async (
    userId: string,
    contactId: string,
): Promise<IContact | null> => {
    if (!userId || !contactId) {
        throw new Error("User ID and contact ID are required");
    }

    const [id1, id2] = [userId, contactId].sort();
    return await Contact.findOne({ userId: id1, contactId: id2 });
}

/**
 * Retrieves all contacts for a user.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves with an array of contacts.
 */
export const getContacts = async (userId: string): Promise<IContact[]> => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const contacts = await Contact.find({
        $or: [
            { userId: userId },
            { contactId: userId },
        ]
    });

    return contacts;
}

/**
 * Removes a contact.
 *
 * @param userId - The ID of the user.
 * @param contactId - The ID of the contact.
 * @returns A promise that resolves to void.
 */
export const removeContact = async (
    userId: string,
    contactId: string,
): Promise<void> => {
    if (!userId || !contactId) {
        throw new Error("User ID and contact ID are required");
    }

    const [id1, id2] = [userId, contactId].sort();
    await Contact.deleteOne({ userId: id1, contactId: id2 });
}

export const contactExists = async ( userId: string, contactId: string): Promise<boolean> => {
    if (!userId || !contactId) {
        throw new Error("User ID and contact ID are required");
    }

    const [id1, id2] = [userId, contactId].sort();
    const contact = await Contact.findOne({ userId: id1, contactId: id2 });
    return !!contact;
}
