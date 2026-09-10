import express from "express";
import { z } from "zod";
import Animal from "../models/Animal.js";
import User from "../models/User.js";
import { requireAdmin, requireAuth, requirePermission } from "../middleware/auth.js";
import { normalizeRole, roleAtLeast } from "../utils/permissions.js";
import Species from "../models/Species.js";
import SpeciesImage from "../models/SpeciesImage.js";
import AuditLog from "../models/AuditLog.js";
import Observation from "../models/Observation.js";
import Identification from "../models/Identification.js";

const router = express.Router();
const animalInput = z.object({
  commonName: z.string().trim().min(2).max(120),
  scientificName: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(60),
  habitat: z.string().trim().max(240).optional(),
  image: z.string().trim().max(500).optional(),
  description: z.string().trim().max(1000).optional(),
  endemic: z.boolean().optional(),
});
const speciesInput = z.object({
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  commonName: z.string().trim().min(2).max(120),
  scientificName: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(60),
  image: z.string().trim().url().max(500).optional().or(z.literal("")),
  habitat: z.string().trim().max(500).optional(),
  region: z.string().trim().max(500).optional(),
  description: z.string().trim().max(2000).optional(),
  conservationStatus: z.string().trim().max(120).optional(),
  endemic: z.boolean().optional(),
  localNames: z.array(z.string().trim().max(80)).optional(),
  references: z.array(z.object({ title: z.string().max(200).optional(), url: z.string().url().max(500).optional(), source: z.string().max(200).optional() })).optional(),
});

router.use(requireAuth, requireAdmin);
router.get("/dashboard", async (_req, res) => {
  const [users, activeUsers, species, endemicSpecies, observations, pendingObservations, identifications] = await Promise.all([
    User.countDocuments(), User.countDocuments({ isActive: true }), Species.countDocuments({ isPublished: true }),
    Species.countDocuments({ isPublished: true, endemic: true }), Observation.countDocuments(),
    Observation.countDocuments({ verificationStatus: "pending" }), Identification.countDocuments(),
  ]);
  return res.json({ success: true, data: { users, activeUsers, species, endemicSpecies, observations, pendingObservations, identifications, publishedNews: 0, importantDays: 0, organizations: 0, pendingSubmissions: 0, newReports: 0 } });
});
router.get("/users", async (_req, res) => res.json({ users: await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean() }));
router.patch("/users/:id/status", requirePermission("users.suspend"), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: Boolean(req.body.isActive) }, { new: true }).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ user });
});
router.patch("/users/:id/role", async (req, res) => {
  const role = z.enum(["USER", "CONTRIBUTOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"]).safeParse(String(req.body.role || "").toUpperCase());
  if (!role.success) return res.status(400).json({ success: false, message: "Invalid role." });
  if (role.data === "SUPER_ADMIN" && normalizeRole(req.user.role) !== "SUPER_ADMIN") return res.status(403).json({ success: false, message: "Only a Super Admin can assign Super Admin." });
  const target = await User.findById(req.params.id).lean();
  if (target && roleAtLeast(target.role, "SUPER_ADMIN") && normalizeRole(req.user.role) !== "SUPER_ADMIN") return res.status(403).json({ success: false, message: "Only a Super Admin can modify a Super Admin." });
  const user = await User.findByIdAndUpdate(req.params.id, { role: role.data }, { new: true }).select("-passwordHash");
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  await AuditLog.create({ adminUserId: req.user._id, action: "changed_role", targetType: "user", targetId: user._id, details: { role: role.data } });
  return res.json({ success: true, data: { user } });
});
router.delete("/users/:id", requirePermission("users.delete"), async (req, res) => {
  if (req.params.id === req.user._id.toString()) return res.status(400).json({ success: false, message: "You cannot delete your own administrator account." });
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  await AuditLog.create({ adminUserId: req.user._id, action: "disabled_user", targetType: "user", targetId: user._id });
  return res.status(204).end();
});
router.get("/animals", async (_req, res) => res.json({ animals: await Animal.find().sort({ createdAt: -1 }).lean() }));
router.post("/animals", async (req, res) => {
  const parsed = animalInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Provide a valid animal record." });
  return res.status(201).json({ animal: await Animal.create(parsed.data) });
});
router.patch("/animals/:id", async (req, res) => {
  const parsed = animalInput.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Provide a valid animal record." });
  const animal = await Animal.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
  if (!animal) return res.status(404).json({ message: "Animal not found." });
  return res.json({ animal });
});
router.delete("/animals/:id", async (req, res) => {
  const animal = await Animal.findByIdAndDelete(req.params.id);
  if (!animal) return res.status(404).json({ message: "Animal not found." });
  return res.status(204).end();
});

router.get("/species", async (_req, res) => {
  const species = await Species.find({ isPublished: { $ne: false } }).sort({ commonName: 1 }).lean();
  return res.json({ success: true, data: { species } });
});
router.post("/species", async (req, res) => {
  const parsed = speciesInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid species information." });
  const data = { ...parsed.data, distribution: { region: parsed.data.region }, createdBy: req.user._id, updatedBy: req.user._id };
  const species = await Species.create(data);
  await AuditLog.create({ adminUserId: req.user._id, action: "created", targetType: "species", targetId: species._id });
  return res.status(201).json({ success: true, data: { species } });
});
router.patch("/species/:id", async (req, res) => {
  const parsed = speciesInput.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid species information." });
  const update = { ...parsed.data, updatedBy: req.user._id };
  if (parsed.data.region !== undefined) update.distribution = { region: parsed.data.region };
  const species = await Species.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!species) return res.status(404).json({ success: false, message: "Species not found." });
  await AuditLog.create({ adminUserId: req.user._id, action: "updated", targetType: "species", targetId: species._id });
  return res.json({ success: true, data: { species } });
});
router.delete("/species/:id", async (req, res) => {
  const species = await Species.findByIdAndUpdate(req.params.id, { isPublished: false, updatedBy: req.user._id }, { new: true });
  if (!species) return res.status(404).json({ success: false, message: "Species not found." });
  await SpeciesImage.deleteMany({ speciesId: species._id });
  await AuditLog.create({ adminUserId: req.user._id, action: "archived", targetType: "species", targetId: species._id });
  return res.status(204).end();
});
router.get("/audit-logs", requirePermission("auditLogs.read"), async (_req, res) => res.json({ success: true, data: { logs: await AuditLog.find().sort({ createdAt: -1 }).limit(100).populate("adminUserId", "name email").lean() } }));

export default router;