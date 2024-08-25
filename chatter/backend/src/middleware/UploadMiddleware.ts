import multer from 'multer';
import mime from 'mime-types';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { getUploadPath } from '../utils/getUploadPath';
import directories from '../config/directories';
import { getIdentifier } from '../utils/getIdentifier';
import { createFile, deleteFileByIdentifier, getFileByIdentifier } from '../services/fileService';
import { removeLocalFile } from '../utils/filesManager';

/**
 * Multer disk storage configuration.
 *
 * @remarks
 * This configuration specifies the destination and filename generation
 * logic for uploaded files.
 * 
 * The destination is determined based on the request path and file type.
 * 
 * The filename is generated using an identifier obtained from
 * the request and the file type.
 *
 * @param req - The Express request object.
 * @param file - The uploaded file object.
 * @param cb - The callback function to be called when the destination
 * is determined.
 * @param cb - The callback function to be called when the filename
 * is generated.
 *
 * @returns void
 */
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const fileType = mime.extension(file.mimetype);

        if (!fileType) {
            return cb(new Error('Invalid file type'), '');
        }

        const uploadPath = getUploadPath(req.path, fileType);
        if (!uploadPath) {
            return cb(new Error('No valid upload path for this file type'), '');
        }
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: async (req: Request, file: Express.Multer.File, cb) => {
        try {
            const fileType = mime.extension(file.mimetype);
            const identifier = await getIdentifier(req);

            if (!identifier) {
                return cb(
                    new Error(
                        'User ID or Message ID is required for filename generation',
                    ),
                    '',
                );
            }

            const existingFile = await getFileByIdentifier(identifier as string);
            if (existingFile) {
                await removeLocalFile(
                    `${existingFile.filePath}${existingFile.identifier}.${existingFile.fileType}`,
                );
            }

            await deleteFileByIdentifier(identifier as string);
            await createFile(
                identifier as string,
                fileType as string,
                getUploadPath(req.path, fileType as string),
            );

            cb(null, `${identifier}.${fileType}`);
        } catch (error) {
            cb(error as Error, '');
        }
    },
});

/**
 * Middleware function for handling file uploads.
 *
 * @remarks
 * This middleware uses Multer to handle file uploads. It checks the file type
 * and allows or rejects the upload based on the request path and file type.
 *
 * @returns - The Multer middleware function.
 */
export const upload = multer({
    storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
        const fileType = mime.extension(file.mimetype);

        if (
            req.path === '/upload-profile' &&
            typeof fileType === 'string' &&
            directories.images.includes(fileType)
        ) {
            cb(null, true);
        } else if (req.path === '/upload-media') {
            if (
                typeof fileType === 'string' &&
                (directories.images.includes(fileType) ||
                    directories.audios.includes(fileType) ||
                    directories.videos.includes(fileType) ||
                    directories.docs.includes(fileType))
            ) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type'));
            }
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});

/**
 * Error handling middleware for the upload process.
 * 
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
export const handleUploadError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
        // An unknown error occurred when uploading.
        res.status(500).json({ message: `Unknown error: ${err.message}` });
    } else {
        // Everything went fine.
        next();
    }
};
