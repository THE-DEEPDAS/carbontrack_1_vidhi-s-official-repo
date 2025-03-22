// routes/certificateRoutes.js
import express from 'express';
import { getCertificates, getAllCertificates, uploadProof, verifyGoal, downloadCertificate } from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', protect, getCertificates);
router.get('/all', protect, getAllCertificates); // For admin to view all certificates
router.post('/upload-proof/:certId/:goalId', protect, upload.single('proof'), uploadProof);
router.put('/verify/:certId/:goalId', protect, verifyGoal);
router.get('/download/:certId', protect, downloadCertificate);
// Remove the duplicate route for getAllUsers
// router.get('/all', protect, getAllUsers); // This was incorrect

export default router;