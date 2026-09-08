import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const user = await User.findById(req.session.userId).lean();
  if (!user || !user.isActive) {
    req.session.destroy(() => {});
    return res.status(401).json({ message: "Your session is no longer valid." });
  }

  req.user = user;
  return next();
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Administrator access required." });
  }

  return next();
}