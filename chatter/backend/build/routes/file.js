"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_1 = __importDefault(require("express"));
const fileController_1 = require("../controllers/fileController");
const UploadMiddleware_1 = require("../middleware/UploadMiddleware");
const router = express_1.default.Router();
router.route('/:identifier').get(authMiddleware_1.protect, fileController_1.getFile);
router.route('/:fileId').delete(authMiddleware_1.protect, fileController_1.deleteFile);
router.route('/upload-profile').post(authMiddleware_1.protect, UploadMiddleware_1.upload.single('file'));
router.route('/upload-media').post(authMiddleware_1.protect, UploadMiddleware_1.upload.single('file'));
exports.default = router;
