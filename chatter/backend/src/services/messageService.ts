import Message, { IMessage } from '../models/message';

export const createMessage = async (senderId: string, recipientId: string, message: string): Promise<IMessage> => {
  const newMessage = new Message({ senderId, recipientId, message });
  return await newMessage.save();
};

/**
 * Retrieves messages between two users.
 * 
 * @param senderId - The ID of the sender user.
 * @param recipientId - The ID of the recipient user.
 * @returns A promise that resolves to an array of messages.
 */
export const getMessagesBetweenUsers = async (senderId: string, recipientId: string): Promise<IMessage[]> => {
  return await Message.find({
    $or: [
      { senderId, recipientId },
      { senderId: recipientId, recipientId: senderId },
    ],
  }).sort({ timestamp: 1 });
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