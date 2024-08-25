import fs from 'fs/promises';

export const removeLocalFile = async (filePath: string): Promise<void> => {
    try {
        await fs.unlink(filePath);
        console.log('File removed successfully');
    } catch (error) {
        console.error('Failed to remove file:', error);
    }
}
