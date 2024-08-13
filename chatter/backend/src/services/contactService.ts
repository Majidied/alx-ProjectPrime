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

    const newContact = new Contact({ userId, contactId });
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

    return await Contact.findOne({ userId, contactId });
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

    return await Contact.find({ userId });
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

    await Contact.deleteOne({ userId, contactId });
}
