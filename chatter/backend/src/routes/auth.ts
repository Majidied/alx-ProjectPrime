import express from 'express';
import {
    registerUser,
    authUser,
    getUserProfile,
    logoutUser,
    ValidateUser,
    resendVerificationEmail,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/logout').post(protect, logoutUser);
router.route('/verify/:token').get(ValidateUser);
router.route('/resend-verification').post(protect, resendVerificationEmail);

export default router;
