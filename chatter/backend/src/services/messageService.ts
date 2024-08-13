import Message, { IMessage } from '../models/message';

/**
 * Creates a new message and saves it to the database.
 * 
 * @param senderId - The ID of the sender of the message.
 * @param recipientId - The ID of the recipient of the message.
 * @param message - The content of the message.
 * @param contactId - The ID of the contact associated with the message.
 * @returns A Promise that resolves to the created message.
 */
export const createMessage = async (senderId: string, recipientId: string, message: string, contactId: string): Promise<IMessage> => {
  const newMessage = new Message({ senderId, recipientId, message, contactId});
  return await newMessage.save();
};

/**
 * Retrieves messages between users based on the provided contact ID.
 * 
 * @param contactId - The ID of the contact.
 * @returns A promise that resolves to an array of messages.
 */
export const getMessagesBetweenUsers = async (contactId: string): Promise<IMessage[]> => {
  return await Message.find({ contactId }).sort({ createdAt: 1 });
};

/**
 * Marks messages as seen.
 * 
 * @param senderId - The ID of the sender.
 * @param recipientId - The ID of the recipient.
 * @returns A promise that resolves to void.
 */
export const markMessagesAsSeen = async (senderId: string, recipientId: string): Promise<void> => {
  await Message.updateMany({ senderId, recipientId }, { seen: true });
};

/**
 * Deletes messages between two users.
 * 
 * @param senderId - The ID of the sender user.
 * @param recipientId - The ID of the recipient user.
 * @returns A promise that resolves to void.
 */
export const deleteMessagesBetweenUsers = async (senderId: string, recipientId: string): Promise<void> => {
  await Message.deleteMany({
    $or: [
      { senderId, recipientId },
      { senderId: recipientId, recipientId: senderId },
    ],
  });
};

/**
 * Deletes a message by its ID.
 * 
 * @param messageId - The ID of the message to be deleted.
 * @returns A promise that resolves to void.
 */
export const deleteMessageById = async (messageId: string): Promise<void> => {
  await Message.findByIdAndDelete(messageId);
}