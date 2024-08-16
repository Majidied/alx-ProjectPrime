import multer from 'multer';
import mime from 'mime-types';
import fs from 'fs';
import { Request } from 'express';
import { getUploadPath } from '../utils/getUploadPath';
import directories from '../config/directories';
import { getIdentifier } from '../utils/getIdentifier';
import { createFile } from '../services/fileService';

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
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: async (req: Request, file: Express.Multer.File, cb) => {
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

        await createFile(
            identifier,
            fileType as string,
            getUploadPath(req.path, fileType as string),
        );

        cb(null, `${identifier}.${fileType}`);
    },
});

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
