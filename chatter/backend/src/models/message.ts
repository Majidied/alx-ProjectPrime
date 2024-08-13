import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    senderId: string;
    recipientId: string;
    message: string;
    seen: boolean;
    contactId: string;
    timestamp: Date;
}

const MessageSchema: Schema = new Schema({
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    contactId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
