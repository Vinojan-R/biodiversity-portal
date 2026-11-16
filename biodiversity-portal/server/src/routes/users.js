import argon2 from "argon2";
import express from "express";
import { z } from "zod";
import Identification from "../models/Identification.js";
import Observation from "../models/Observation.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { normalizeRole } from "../utils/permissions.js";

const router = express.Router();
const profileInput = z.object({
  name: z.string().trim().min(2).max(80),
  username: z.string().trim().toLowerCase().min(3).max(40).regex(/^[a-z0-9_]+$/).optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional(),
  country: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  profileImageUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
});
const settingsInput = z.object({
  privacySettings: z.object({ profileVisible: z.boolean(), findingsVisible: z.boolean(), locationVisible: z.boolean() }).optional(),
  notificationSettings: z.object({ emailNotifications: z.boolean(), securityNotifications: z.boolean(), activityNotifications: z.boolean() }).optional(),
});
const passwordInput = z.object({ currentPassword: z.string().min(1).max(128), newPassword: z.string().min(8).max(128) });

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username || "",
    email: user.email,
    role: normalizeRole(user.role),
    profileImageUrl: user.profileImageUrl || "",
    bio: user.bio || "",
    country: user.country || "",
    city: user.city || "",
    privacySettings: user.privacySettings || {},
    notificationSettings: user.notificationSettings || {},
    createdAt: user.createdAt,
  };
}

router.use(requireAuth);

router.get("/profile", async (req, res) => {
  const [user, findings, verifiedFindings, identified, species] = await Promise.all([
    User.findById(req.user._id).lean(),
    Observation.countDocuments({ userId: req.user._id }),
    Observation.countDocuments({ userId: req.user._id, verificationStatus: "verified" }),
    Identification.countDocuments({ userId: req.user._id }),
    Observation.distinct("speciesId", { userId: req.user._id, speciesId: { $exists: true } }),
  ]);
  return res.json({ success: true, data: { user: publicUser(user), stats: { findings, verifiedFindings, identifications: identified, identifiedSpecies: species.length } } });
});

router.put("/profile", async (req, res) => {
  const parsed = profileInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Enter a valid name, username, location and profile image URL." });
  const update = { ...parsed.data, username: parsed.data.username || undefined };
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true }).lean();
  return res.json({ success: true, data: { user: publicUser(user) } });
});

router.get("/settings", async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  return res.json({ success: true, data: { privacySettings: user.privacySettings || {}, notificationSettings: user.notificationSettings || {} } });
});

router.put("/settings", async (req, res) => {
  const parsed = settingsInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid privacy and notification settings." });
  const user = await User.findByIdAndUpdate(req.user._id, parsed.data, { new: true, runValidators: true }).lean();
  return res.json({ success: true, data: { user: publicUser(user) } });
});

router.put("/change-password", async (req, res) => {
  const parsed = passwordInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Enter your current password and a new password of at least 8 characters." });
  const user = await User.findById(req.user._id).select("+passwordHash");
  if (!user.passwordHash || !(await argon2.verify(user.passwordHash, parsed.data.currentPassword))) return res.status(401).json({ success: false, message: "The current password is incorrect." });
  user.passwordHash = await argon2.hash(parsed.data.newPassword);
  await user.save();
  return res.json({ success: true, message: "Password changed successfully." });
});

export default router;