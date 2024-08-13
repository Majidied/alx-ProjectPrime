import { protect } from '../middleware/authMiddleware';
import express from "express";
import { createContact, getContactById, getContactsForUser, deleteContact } from '../controllers/contactController';

const router = express.Router();

router.route('/create').post(protect, createContact);
router.route('/get').get(protect, getContactsForUser);
router.route('/get/:id').get(protect, getContactById);
router.route('/delete/:id').delete(protect, deleteContact);

export default router;
