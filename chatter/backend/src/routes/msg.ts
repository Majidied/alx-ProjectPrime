import { sendMessage, getMessages, getLastMessage, getUnseenMessages } from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';
import express from 'express';

const router = express.Router();

router.route('/send/').post(protect, sendMessage);
router.route('/get/:contactId').get(protect, getMessages);
router.route('/get-last/:contactId').get(protect, getLastMessage);
router.route('/get-unseen').post(protect, getUnseenMessages);

export default router;
