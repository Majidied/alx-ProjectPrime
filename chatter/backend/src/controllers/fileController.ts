import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { deleteFileById, deleteFileFromServer, getFileById, getFileByIdentifier } from '../services/fileService';
import { getUserIdByToken } from '../utils/TokenUtils';

export const handleFileUpload = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    res.status(200).send('File uploaded successfully.');
};

/**
 * Retrieves the profile picture of the user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The profile picture as a stream.
 */
export const getProfilePicture = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await getUserIdByToken(token as string);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const file = await getFileByIdentifier(userId);
        console.log(file);

        if (!file || !file.filePath || !file.fileType) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.join(file.filePath, `${file.identifier}.${file.fileType}`);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        const fileStream = fs.createReadStream(filePath);

        res.setHeader('Content-Type', file.fileType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.identifier}.${file.fileType}"`);

        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error('Error reading file:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
    } catch (error) {
        console.error('Error getting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}


/**
 * Retrieves a file from the server.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The file as a stream.
 */
export const getFile = async (req: Request, res: Response) => {
    const { identifier } = req.params;
    console.log(identifier);

    try {
        const file = await getFileByIdentifier(identifier);
        console.log(file);

        if (!file || !file.filePath || !file.fileType) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.join(file.filePath, `${file.identifier}.${file.fileType}`);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        const fileStream = fs.createReadStream(filePath);

        res.setHeader('Content-Type', file.fileType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.identifier}.${file.fileType}"`);

        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error('Error reading file:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
    } catch (error) {
        console.error('Error getting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


/**
 * Deletes a file from the server.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with a success message.
 */
export const deleteFile = async (req: Request, res: Response) => {
    const { fileId } = req.params;

    try {
        const file = await getFileById(fileId);
        await deleteFileById(fileId);
        await deleteFileFromServer(file);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
