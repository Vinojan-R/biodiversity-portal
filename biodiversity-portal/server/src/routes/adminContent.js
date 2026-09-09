import express from "express";
import { z } from "zod";
import News from "../models/News.js";
import ImportantDay from "../models/ImportantDay.js";
import Organization from "../models/Organization.js";
import Submission from "../models/Submission.js";
import WildlifeReport from "../models/WildlifeReport.js";
import AuditLog from "../models/AuditLog.js";
import { requireAuth, requireAdmin, requirePermission } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth, requireAdmin);

const newsInput = z.object({ title: z.string().trim().min(2).max(180), slug: z.string().trim().regex(/^[a-z0-9-]+$/), summary: z.string().trim().min(2).max(500), content: z.string().max(10000).optional(), image: z.string().url().optional().or(z.literal("")), category: z.string().trim().max(80), source: z.string().trim().min(2).max(180), sourceUrl: z.string().url(), status: z.enum(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]).optional(), featured: z.boolean().optional() });
const dayInput = z.object({ name: z.string().trim().min(2).max(180), date: z.coerce.date(), description: z.string().max(1000).optional(), importance: z.string().max(1000).optional(), officialUrl: z.string().url().optional().or(z.literal("")), status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional() });
const organizationInput = z.object({ name: z.string().trim().min(2).max(180), type: z.string().trim().min(2).max(80), description: z.string().max(1000).optional(), website: z.string().url().optional().or(z.literal("")), verificationStatus: z.enum(["UNVERIFIED", "VERIFIED", "OUTDATED"]).optional(), phone: z.string().max(50).optional(), email: z.string().email().optional().or(z.literal("")), address: z.string().max(500).optional() });

function writeAudit(req, action, targetType, targetId, details = {}) {
  return AuditLog.create({ adminUserId: req.user._id, action, targetType, targetId, details });
}

router.get("/content-summary", async (_req, res) => {
  const [publishedNews, importantDays, organizations, pendingSubmissions, newReports] = await Promise.all([
    News.countDocuments({ status: "PUBLISHED" }), ImportantDay.countDocuments({ status: "PUBLISHED" }), Organization.countDocuments({ isArchived: false }), Submission.countDocuments({ status: { $in: ["PENDING", "UNDER_REVIEW"] } }), WildlifeReport.countDocuments({ status: { $in: ["NEW", "UNDER_REVIEW"] } }),
  ]);
  return res.json({ success: true, data: { publishedNews, importantDays, organizations, pendingSubmissions, newReports } });
});

router.get("/news", async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const news = await News.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  return res.json({ success: true, data: { news } });
});
router.post("/news", requirePermission("news.create"), async (req, res) => {
  const parsed = newsInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid sourced news details." });
  const news = await News.create({ ...parsed.data, createdBy: req.user._id });
  await writeAudit(req, "ADMIN_CREATED_NEWS", "news", news._id);
  return res.status(201).json({ success: true, data: { news } });
});
router.patch("/news/:id", requirePermission("news.update"), async (req, res) => {
  const parsed = newsInput.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid sourced news details." });
  const news = await News.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
  if (!news) return res.status(404).json({ success: false, message: "News not found." });
  await writeAudit(req, "ADMIN_UPDATED_NEWS", "news", news._id);
  return res.json({ success: true, data: { news } });
});
router.delete("/news/:id", requirePermission("news.delete"), async (req, res) => { const news = await News.findByIdAndUpdate(req.params.id, { status: "ARCHIVED" }, { new: true }); if (!news) return res.status(404).json({ success: false, message: "News not found." }); await writeAudit(req, "ADMIN_ARCHIVED_NEWS", "news", news._id); return res.status(204).end(); });

router.get("/important-days", async (_req, res) => res.json({ success: true, data: { days: await ImportantDay.find().sort({ date: 1 }).lean() } }));
router.post("/important-days", requirePermission("importantDays.manage"), async (req, res) => { const parsed = dayInput.safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid important day details." }); const day = await ImportantDay.create({ ...parsed.data, month: parsed.data.date.getUTCMonth() + 1 }); await writeAudit(req, "ADMIN_CREATED_IMPORTANT_DAY", "importantDay", day._id); return res.status(201).json({ success: true, data: { day } }); });
router.patch("/important-days/:id", requirePermission("importantDays.manage"), async (req, res) => { const parsed = dayInput.partial().safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid important day details." }); const update = { ...parsed.data }; if (parsed.data.date) update.month = parsed.data.date.getUTCMonth() + 1; const day = await ImportantDay.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }); if (!day) return res.status(404).json({ success: false, message: "Important day not found." }); await writeAudit(req, "ADMIN_UPDATED_IMPORTANT_DAY", "importantDay", day._id); return res.json({ success: true, data: { day } }); });

router.get("/organizations", async (_req, res) => res.json({ success: true, data: { organizations: await Organization.find({ isArchived: false }).sort({ name: 1 }).lean() } }));
router.post("/organizations", requirePermission("organizations.manage"), async (req, res) => { const parsed = organizationInput.safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid organization details." }); const organization = await Organization.create(parsed.data); await writeAudit(req, "ADMIN_CREATED_ORGANIZATION", "organization", organization._id); return res.status(201).json({ success: true, data: { organization } }); });
router.patch("/organizations/:id", requirePermission("organizations.manage"), async (req, res) => { const parsed = organizationInput.partial().safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid organization details." }); const organization = await Organization.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }); if (!organization) return res.status(404).json({ success: false, message: "Organization not found." }); await writeAudit(req, "ADMIN_UPDATED_ORGANIZATION", "organization", organization._id); return res.json({ success: true, data: { organization } }); });

router.get("/submissions", requirePermission("submission.review"), async (_req, res) => res.json({ success: true, data: { submissions: await Submission.find().populate("userId", "name email").populate("speciesId", "commonName scientificName").sort({ createdAt: -1 }).limit(100).lean() } }));
router.patch("/submissions/:id", requirePermission("submission.review"), async (req, res) => { const status = z.enum(["UNDER_REVIEW", "APPROVED", "REJECTED", "NEEDS_CORRECTION"]).safeParse(req.body.status); if (!status.success) return res.status(400).json({ success: false, message: "Invalid submission status." }); const submission = await Submission.findByIdAndUpdate(req.params.id, { status: status.data, reviewNotes: req.body.reviewNotes, reviewedBy: req.user._id }, { new: true }); if (!submission) return res.status(404).json({ success: false, message: "Submission not found." }); await writeAudit(req, `ADMIN_${status.data}_SUBMISSION`, "submission", submission._id); return res.json({ success: true, data: { submission } }); });
router.get("/reports", requirePermission("submission.review"), async (_req, res) => res.json({ success: true, data: { reports: await WildlifeReport.find().populate("reporterId", "name email").sort({ createdAt: -1 }).limit(100).lean() } }));
router.patch("/reports/:id", requirePermission("submission.review"), async (req, res) => { const status = z.enum(["NEW", "UNDER_REVIEW", "FORWARDED", "IN_PROGRESS", "RESOLVED", "REJECTED"]).safeParse(req.body.status); if (!status.success) return res.status(400).json({ success: false, message: "Invalid report status." }); const report = await WildlifeReport.findByIdAndUpdate(req.params.id, { status: status.data, notes: req.body.notes, assignedTo: req.body.assignedTo }, { new: true }); if (!report) return res.status(404).json({ success: false, message: "Report not found." }); await writeAudit(req, `ADMIN_${status.data}_REPORT`, "wildlifeReport", report._id); return res.json({ success: true, data: { report } }); });
router.get("/audit-logs", requirePermission("auditLogs.read"), async (_req, res) => res.json({ success: true, data: { logs: await AuditLog.find().sort({ createdAt: -1 }).limit(100).populate("adminUserId", "name email").lean() } }));

export default router;
