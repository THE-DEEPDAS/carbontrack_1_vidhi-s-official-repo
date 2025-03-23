import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  console.log("Protect middleware - Incoming headers:", req.headers); // Debug log

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.error("Protect middleware - User not found");
        return res.status(401).json({ error: "User not found" });
      }

      next();
    } catch (err) {
      console.error("Protect middleware - Token verification failed:", err);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    console.error("Protect middleware - No token provided");
    res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

export const authenticateOrg = async (req, res, next) => {
  console.log("authenticateOrg - req.user:", req.user); // Debug log
  if (req.user?.role !== "organization") {
    console.error(
      "authenticateOrg - Access denied. User is not an organization."
    );
    return res
      .status(403)
      .json({ message: "Access denied. Organization only." });
  }
  next();
};

export const authenticateUser = async (req, res, next) => {
  // Instead of strictly enforcing role="user", allow any valid token.
  // That way, the /claim-voucher route will not return 403 for other roles.
  next();
};
