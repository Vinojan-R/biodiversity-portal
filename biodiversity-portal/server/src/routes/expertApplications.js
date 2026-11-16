import express from "express";
import { z } from "zod";
import ExpertApplication from "../models/ExpertApplication.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { requireAuth, requirePermission } from "../middleware/auth.js";

const router = express.Router();
const record = z.object({
  title: z.string().trim().min(2).max(160), institution: z.string().trim().max(160), year: z.coerce.number().int().min(1900).max(2100), evidenceUrl: z.string().url().max(500).optional().or(z.literal("")),
});
const applicationInput = z.object({
  personal: z.object({ fullName: z.string().trim().min(2).max(120), professionalEmail: z.string().email().max(160), institution: z.string().trim().max(160), country: z.string().trim().max(80), city: z.string().trim().max(80) }),
  qualifications: z.array(record).max(20),
  experience: z.array(z.object({ role: z.string().trim().min(2).max(160), organization: z.string().trim().max(160), years: z.coerce.number().min(0).max(80), description: z.string().trim().max(1000) })).max(20),
  specializations: z.array(z.string().trim().min(2).max(120)).min(1).max(20),
  publications: z.array(z.object({ title: z.string().trim().min(2).max(240), url: z.string().url().max(500), year: z.coerce.number().int().min(1900).max(2100) })).max(30),
  professionalLinks: z.array(z.object({ label: z.string().trim().max(80), url: z.string().url().max(500) })).max(20),
  statement: z.string().trim().min(30).max(3000),
  supportingDocuments: z.array(z.object({ name: z.string().trim().max(160), url: z.string().url().max(500) })).max(20),
});

router.use(requireAuth);
router.get("/mine", async (req, res) => res.json({ success: true, data: { application: await ExpertApplication.findOne({ userId: req.user._id }).lean() } }));
router.put("/mine", async (req, res) => {
  const parsed = applicationInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Complete the required expert application fields." });
  const existing = await ExpertApplication.findOne({ userId: req.user._id });
  if (existing?.status === "APPROVED" || existing?.status === "SUSPENDED") return res.status(409).json({ success: false, message: "This expert application can no longer be edited." });
  const application = await ExpertApplication.findOneAndUpdate({ userId: req.user._id }, { ...parsed.data, status: "DRAFT" }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
  return res.json({ success: true, data: { application } });
});
router.post("/mine/submit", async (req, res) => {
  const application = await ExpertApplication.findOne({ userId: req.user._id });
  if (!application) return res.status(404).json({ success: false, message: "Save your application before submitting it." });
  if (!["DRAFT", "ADDITIONAL_INFORMATION_REQUIRED", "REJECTED"].includes(application.status)) return res.status(409).json({ success: false, message: "This application is already being processed." });
  application.status = "SUBMITTED";
  await application.save();
  return res.json({ success: true, data: { application } });
});

router.get("/", requirePermission("expert.view"), async (req, res) => {
  const status = req.query.status ? String(req.query.status).toUpperCase() : undefined;
  const filter = status ? { status } : { status: { $ne: "DRAFT" } };
  return res.json({ success: true, data: { applications: await ExpertApplication.find(filter).populate("userId", "name email profileImageUrl").sort({ updatedAt: -1 }).limit(200).lean() } });
});
router.patch("/:id/review", requirePermission("expert.review"), async (req, res) => {
  const status = z.enum(["UNDER_REVIEW", "ADDITIONAL_INFORMATION_REQUIRED", "APPROVED", "REJECTED", "SUSPENDED"]).safeParse(String(req.body.status || "").toUpperCase());
  const notes = z.string().trim().max(2000).optional().safeParse(req.body.reviewNotes);
  if (!status.success || !notes.success) return res.status(400).json({ success: false, message: "Provide a valid review status and notes." });
  const application = await ExpertApplication.findByIdAndUpdate(req.params.id, { status: status.data, reviewNotes: notes.data, reviewedBy: req.user._id }, { new: true }).populate("userId", "name email");
  if (!application) return res.status(404).json({ success: false, message: "Expert application not found." });
  if (status.data === "APPROVED") await User.findByIdAndUpdate(application.userId._id, { role: "RESEARCHER", expertVerified: true, expertSpecializations: application.specializations });
  if (status.data === "SUSPENDED") await User.findByIdAndUpdate(application.userId._id, { expertVerified: false });
  await AuditLog.create({ adminUserId: req.user._id, action: `EXPERT_APPLICATION_${status.data}`, targetType: "expertApplication", targetId: application._id, details: { reviewNotes: notes.data } });
  return res.json({ success: true, data: { application } });
});

export default router;