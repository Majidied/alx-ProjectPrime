"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageController_1 = require("../controllers/messageController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route('/send').post(authMiddleware_1.protect, messageController_1.sendMessage);
router.route('/get').post(authMiddleware_1.protect, messageController_1.getMessages);
exports.default = router;
