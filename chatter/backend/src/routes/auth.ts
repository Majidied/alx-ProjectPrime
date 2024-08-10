import express from 'express';
import {
    registerUser,
    authUser,
    getUserProfile,
    logoutUser,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/logout').post(protect, logoutUser);

export default router;
