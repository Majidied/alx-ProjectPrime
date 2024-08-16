"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fileService_1 = require("../services/fileService");
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.params;
    try {
        const file = yield (0, fileService_1.getFileByIdentifier)(identifier);
        if (!file || !file.filePath || !file.fileType) {
            return res.status(404).json({ message: 'File not found' });
        }
        const filePath = path_1.default.join(file.filePath, `${file.identifier}.${file.fileType}`);
        // Check if the file exists
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }
        const fileStream = fs_1.default.createReadStream(filePath);
        res.setHeader('Content-Type', file.fileType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.identifier}.${file.fileType}"`);
        fileStream.pipe(res);
        fileStream.on('error', (error) => {
            console.error('Error reading file:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
    }
    catch (error) {
        console.error('Error getting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getFile = getFile;
/**
 * Deletes a file from the server.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with a success message.
 */
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId } = req.params;
    try {
        const file = yield (0, fileService_1.getFileById)(fileId);
        yield (0, fileService_1.deleteFileById)(fileId);
        yield (0, fileService_1.deleteFileFromServer)(file);
        res.json({ message: 'File deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteFile = deleteFile;
