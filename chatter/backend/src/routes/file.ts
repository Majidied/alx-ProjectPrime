import { protect } from '../middleware/authMiddleware';
import express from 'express';
import { getFile, deleteFile, handleFileUpload, getProfilePicture } from '../controllers/fileController';
import { upload } from '../middleware/UploadMiddleware';


const router = express.Router();

router.route('/profile').get(protect, getProfilePicture);
router.route('/:identifier').get(protect, getFile);
router.route('/:fileId').delete(protect, deleteFile);
router.route('/upload-profile').post(protect, upload.single('file'), handleFileUpload);
router.route('/upload-media').post(protect, upload.single('file'), handleFileUpload);

export default router;
