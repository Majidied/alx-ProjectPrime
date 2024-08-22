import { protect } from '../middleware/authMiddleware';
import express from 'express';
import { searchUser, getUser, getUserStatusController } from '../controllers/userController';

const router = express.Router();

router.route('/search').post(protect, searchUser);
router.route('/:id').get(protect, getUser);
router.route('/user-status/:id').get(protect, getUserStatusController);

export default router;
