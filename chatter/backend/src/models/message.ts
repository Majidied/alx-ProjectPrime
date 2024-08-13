import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  recipientId: string;
  message: string;
  seen: boolean;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
