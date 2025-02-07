/**
 * Represents a contact.
 */
export interface Contact {
    avatar: string;     // URL or path to the contact's avatar image
    name: string;       // Name of the contact
    message: string;    // Last message sent or received from the contact
    time: string;       // Timestamp of the last message
    _id: string;        // Unique identifier for the contact
    userId: string;     // ID of the user associated with this contact
    contactId: string;  // ID of the contact person
  }