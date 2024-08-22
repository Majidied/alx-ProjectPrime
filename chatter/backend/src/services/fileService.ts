import File, { IFile } from '../models/file';
import fs from 'fs';

/**
 * Creates a new file and saves it to the database.
 *
 * @param identifier - The ID of the user or message associated with the file.
 * @param fileType - The type of the file.
 * @param filePath - The path to the file.
 * @returns A Promise that resolves to the created file.
 */
export const createFile = async (
    identifier: string,
    fileType: string,
    filePath: string,
): Promise<IFile> => {
    const newFile = new File({ identifier, fileType, filePath });
    return await newFile.save();
};

/**
 * Retrieves a file by its identifier.
 * 
 * @param identifier - The identifier of the file.
 * @returns A promise that resolves to the file.
 * @throws Error if the file is not found.
 */
export const getFileByIdentifier = async (identifier: string): Promise<IFile> => {
    const file = await File.findOne({ identifier });
    if (!file) {
        return null as any;
    }
    return file;
}

/**
 * Retrieves a file by its ID.
 *
 * @param fileId - The ID of the file.
 * @returns A promise that resolves to the file.
 */
export const getFileById = async (fileId: string): Promise<IFile> => {
    const file = await File.findById(fileId);
    if (!file) {
        throw new Error('File not found');
    }
    return file;
}

/**
 * Deletes a file by its ID.
 *
 * @param fileId - The ID of the file to be deleted.
 * @returns A promise that resolves to void.
 */
export const deleteFileById = async (fileId: string): Promise<void> => {
    await File.findByIdAndDelete(fileId);
};

/**
 * Deletes a file from the server.
 *
 * @param file - The file to be deleted.
 * @returns A promise that resolves to void.
 */
export const deleteFileFromServer = async (file: IFile): Promise<void> => {
    fs.unlink(file.filePath + file.identifier + '.' + file.fileType, (err) => {
        if (err) {
            throw err;
        }
    });
};
