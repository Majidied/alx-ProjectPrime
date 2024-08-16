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
exports.deleteFileFromServer = exports.deleteFileById = exports.getFileById = exports.getFileByIdentifier = exports.createFile = void 0;
const file_1 = __importDefault(require("../models/file"));
const fs_1 = __importDefault(require("fs"));
/**
 * Creates a new file and saves it to the database.
 *
 * @param identifier - The ID of the user or message associated with the file.
 * @param fileType - The type of the file.
 * @param filePath - The path to the file.
 * @returns A Promise that resolves to the created file.
 */
const createFile = (identifier, fileType, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const newFile = new file_1.default({ identifier, fileType, filePath });
    return yield newFile.save();
});
exports.createFile = createFile;
/**
 * Retrieves a file by its identifier.
 *
 * @param identifier - The identifier of the file.
 * @returns A promise that resolves to the file.
 * @throws Error if the file is not found.
 */
const getFileByIdentifier = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield file_1.default.findOne({ identifier });
    if (!file) {
        throw new Error('File not found');
    }
    return file;
});
exports.getFileByIdentifier = getFileByIdentifier;
/**
 * Retrieves a file by its ID.
 *
 * @param fileId - The ID of the file.
 * @returns A promise that resolves to the file.
 */
const getFileById = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield file_1.default.findById(fileId);
    if (!file) {
        throw new Error('File not found');
    }
    return file;
});
exports.getFileById = getFileById;
/**
 * Deletes a file by its ID.
 *
 * @param fileId - The ID of the file to be deleted.
 * @returns A promise that resolves to void.
 */
const deleteFileById = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    yield file_1.default.findByIdAndDelete(fileId);
});
exports.deleteFileById = deleteFileById;
/**
 * Deletes a file from the server.
 *
 * @param file - The file to be deleted.
 * @returns A promise that resolves to void.
 */
const deleteFileFromServer = (file) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.unlink(file.filePath + file.identifier + '.' + file.fileType, (err) => {
        if (err) {
            throw err;
        }
    });
});
exports.deleteFileFromServer = deleteFileFromServer;
