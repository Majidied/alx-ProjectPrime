import path from 'path';
import directories from '../config/directories';

/**
 * Returns the upload path based on the request path and file type.
 * 
 * @param reqPath - The request path.
 * @param fileType - The file type.
 * @returns The upload path.
 */
export const getUploadPath = (reqPath: string, fileType: string): string => {
    switch (reqPath) {
        case '/upload-profile':
            if (directories.images.includes(fileType)) {
                return path.join(__dirname, '../uploads/profile/');
            }
            break;
        case '/upload-media':
            if (directories.images.includes(fileType)) {
                return path.join(__dirname, '../uploads/media/images/');
            } else if (directories.audios.includes(fileType)) {
                return path.join(__dirname, '../uploads/media/audios/');
            } else if (directories.videos.includes(fileType)) {
                return path.join(__dirname, '../uploads/media/videos/');
            } else if (directories.docs.includes(fileType)) {
                return path.join(__dirname, '../uploads/media/docs/');
            }
            break;
        default:
            break;
    }
    return '';
};
