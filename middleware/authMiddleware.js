import jwt from "jsonwebtoken";

const authMiddleware = (requiredRole = null) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // contains: { userId, role }

      // Optional: check role if route is restricted
      if (requiredRole && req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Access denied: Insufficient role" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default authMiddleware;
