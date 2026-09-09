import User from "../models/User.js";
import { hasPermission, normalizeRole, roleAtLeast } from "../utils/permissions.js";

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
  req.user.role = normalizeRole(user.role);
  return next();
}

export function requireAdmin(req, res, next) {
  if (!roleAtLeast(req.user?.role, "ADMIN")) {
    return res.status(403).json({ message: "Administrator access required." });
  }

  return next();
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user?.role, permission)) return res.status(403).json({ message: "You do not have permission for this action." });
    return next();
  };
}