import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  userId: string;
  contactId: string;
}

const ContactSchema: Schema = new Schema({
  userId: { type: String, required: true },
  contactId: { type: String, required: true },
});

const Contact = mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
