import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Updated generateToken to include role in the token payload
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "5d", // Token expires in 5 days
  });
};

export const register = async (req, res) => {
  try {
    const { email, password, role, organizationName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role === "organization" && !organizationName) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    const user = await User.create({
      email,
      password, // Password will be hashed in the User model's pre-save hook
      role,
      organizationName,
    });

    // Generate token with role included
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true, // Added success field for consistency
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName || null, // Ensure null if undefined
      },
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token with role included
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include role in the payload
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true, // Added success field for consistency
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName || null,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log("Fetching profile for user ID:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName || null,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
