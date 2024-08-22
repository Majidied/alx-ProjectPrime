import { protect } from '../middleware/authMiddleware';
import express from 'express';
import { searchUser, getUser } from '../controllers/userController';

const router = express.Router();

router.route('/search').post(protect, searchUser);
router.route('/:id').get(protect, getUser);

export default router;
