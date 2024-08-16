"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/register').post(authController_1.registerUser);
router.route('/login').post(authController_1.authUser);
router.route('/profile').get(authMiddleware_1.protect, authController_1.getUserProfile);
router.route('/logout').post(authMiddleware_1.protect, authController_1.logoutUser);
router.route('/verify/:token').get(authController_1.ValidateUser);
router.route('/resend-verification').post(authMiddleware_1.protect, authController_1.resendVerificationEmail);
exports.default = router;
