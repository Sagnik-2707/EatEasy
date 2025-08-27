import jwt from "jsonwebtoken";

// Middleware to check authentication via cookie
export function authMiddleware(req, res, next) {
  const token = req.cookies?.auth_token; // ✅ get token from cookie

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // attach decoded payload to req
    next();
  });
}

// Middleware to check role-based access
export function roleMiddleware(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}
