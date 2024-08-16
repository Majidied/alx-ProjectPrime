"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const router = express_1.default.Router();
router.route('/send-request').post(authMiddleware_1.protect, contactController_1.sendContactRequest);
router.route('/create').post(authMiddleware_1.protect, contactController_1.createContact);
router.route('/get').get(authMiddleware_1.protect, contactController_1.getContactsForUser);
router.route('/get/:id').get(authMiddleware_1.protect, contactController_1.getContactById);
router.route('/delete/:id').delete(authMiddleware_1.protect, contactController_1.deleteContact);
exports.default = router;
