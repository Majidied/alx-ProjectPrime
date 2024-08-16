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
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const mime_types_1 = __importDefault(require("mime-types"));
const getUploadPath_1 = require("../utils/getUploadPath");
const directories_1 = __importDefault(require("../config/directories"));
const getIdentifier_1 = require("../utils/getIdentifier");
const fileService_1 = require("../services/fileService");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const fileType = mime_types_1.default.extension(file.mimetype);
        if (!fileType) {
            return cb(new Error('Invalid file type'), '');
        }
        const uploadPath = (0, getUploadPath_1.getUploadPath)(req.path, fileType);
        if (!uploadPath) {
            return cb(new Error('No valid upload path for this file type'), '');
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        const fileType = mime_types_1.default.extension(file.mimetype);
        const identifier = yield (0, getIdentifier_1.getIdentifier)(req);
        if (!identifier) {
            return cb(new Error('User ID or Message ID is required for filename generation'), '');
        }
        yield (0, fileService_1.createFile)(identifier, fileType, (0, getUploadPath_1.getUploadPath)(req.path, fileType));
        cb(null, `${identifier}.${fileType}`);
    }),
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const fileType = mime_types_1.default.extension(file.mimetype);
        if (req.path === '/upload-profile' &&
            typeof fileType === 'string' &&
            directories_1.default.images.includes(fileType)) {
            cb(null, true);
        }
        else if (req.path === '/upload-media') {
            if (typeof fileType === 'string' &&
                (directories_1.default.images.includes(fileType) ||
                    directories_1.default.audios.includes(fileType) ||
                    directories_1.default.videos.includes(fileType) ||
                    directories_1.default.docs.includes(fileType))) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type'));
            }
        }
        else {
            cb(new Error('Invalid file type'));
        }
    },
});
