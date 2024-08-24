import { protect } from '../middleware/authMiddleware';
import express from 'express';
import {
    sendContactRequest,
    getContactRequestsForUser,
    createContact,
    getContactById,
    getContactsForUser,
    deleteContact,
    declineContactRequest,
} from '../controllers/contactController';

const router = express.Router();

router.route('/send-request').post(protect, sendContactRequest);
router.route('/get-requests').get(protect, getContactRequestsForUser);
router.route('/create').post(protect, createContact);
router.route('/get').get(protect, getContactsForUser);
router.route('/get/:id').get(protect, getContactById);
router.route('/delete/:contactId').delete(protect, deleteContact);
router.route('/decline/:senderId').delete(protect, declineContactRequest);

export default router;
