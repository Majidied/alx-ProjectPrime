"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadPath = void 0;
const path_1 = __importDefault(require("path"));
const directories_1 = __importDefault(require("../config/directories"));
const getUploadPath = (reqPath, fileType) => {
    switch (reqPath) {
        case '/upload-profile':
            if (directories_1.default.images.includes(fileType)) {
                return path_1.default.join(__dirname, '../uploads/profile/');
            }
            break;
        case '/upload-media':
            if (directories_1.default.images.includes(fileType)) {
                return path_1.default.join(__dirname, '../uploads/media/images/');
            }
            else if (directories_1.default.audios.includes(fileType)) {
                return path_1.default.join(__dirname, '../uploads/media/audios/');
            }
            else if (directories_1.default.videos.includes(fileType)) {
                return path_1.default.join(__dirname, '../uploads/media/videos/');
            }
            else if (directories_1.default.docs.includes(fileType)) {
                return path_1.default.join(__dirname, '../uploads/media/docs/');
            }
            break;
        default:
            break;
    }
    return '';
};
exports.getUploadPath = getUploadPath;
