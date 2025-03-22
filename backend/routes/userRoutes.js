// backend/routes/userRoutes.js
import express from 'express';
import { getAllUsers } from '../controllers/userController.js'; // Import from userController
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Route to get all users (admin only)
router.get('/all', protect, getAllUsers);

export default router;