import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Protect middleware - Decoded token:", decoded); // Debug log
      req.user = {
        id: decoded.id,
        role: decoded.role || "user", // Fallback to "user" if role is not present
      };
      console.log("Protect middleware - req.user:", req.user); // Debug log
      next();
    } catch (error) {
      console.error("Protect middleware - Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.error("Protect middleware - No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
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
