import { protect } from '../middleware/authMiddleware';
import express from 'express';
import {
    sendContactRequest,
    createContact,
    getContactById,
    getContactsForUser,
    deleteContact,
} from '../controllers/contactController';

const router = express.Router();

router.route('/send-request').post(protect, sendContactRequest);
router.route('/create').post(protect, createContact);
router.route('/get').get(protect, getContactsForUser);
router.route('/get/:id').get(protect, getContactById);
router.route('/delete/:contactId').delete(protect, deleteContact);

export default router;
