/**
 * Interface representing a Message object.
 */
export interface Message {
    id: string;           // Unique identifier for the message
    senderId: string;     // ID of the user who sent the message
    recipientId: string;  // ID of the user who received the message
    message: string;      // The content of the message
    seen: boolean;        // Indicates whether the message has been seen
    contactId: string;    // ID of the contact associated with the message
    timestamp: string;    // Timestamp of when the message was sent
}
