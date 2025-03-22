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
      console.log("Protect middleware - Decoded token:", decoded); // Debug
      req.user = {
        id: decoded.id,
        role: decoded.role || "user", // Fallback to "user" if role is not present
      };
      console.log("Protect middleware - req.user:", req.user); // Debug
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
