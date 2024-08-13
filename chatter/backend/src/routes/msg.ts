import { sendMessage, getMessages } from "../controllers/messageController";
import { protect } from '../middleware/authMiddleware';
import express from "express";

const router = express.Router();

router.route('/send').post(protect, sendMessage);
router.route('/get').post(protect, getMessages);

export default router;
