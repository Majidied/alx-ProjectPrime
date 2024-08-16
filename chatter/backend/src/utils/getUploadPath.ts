import path from 'path';
import directories from '../config/directories';

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
