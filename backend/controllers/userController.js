// backend/controllers/userController.js
import User from '../models/User.js';

// Fetch all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    console.log("getAllUsers - req.user:", req.user);
    const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : null;
    console.log("getAllUsers - userRole:", userRole);
    if (userRole !== 'admin') {
      console.log("getAllUsers - Unauthorized access attempt");
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Fetch all users, excluding their passwords
    const users = await User.find().select('-password').exec();
    console.log("getAllUsers - Fetched users:", users);

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("getAllUsers - Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};