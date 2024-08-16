import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
    identifier: string;
    fileType: string;
    filePath: string;
    dateUploaded: Date;
}

const fileSchema: Schema = new Schema({
    identifier: { type: String, required: true },
    fileType: { type: String, required: true },
    filePath: { type: String, required: true },
    dateUploaded: { type: Date, default: Date.now },
});

const File = mongoose.model<IFile>('File', fileSchema);

export default File;
