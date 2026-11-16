import express from "express";
import { z } from "zod";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const messageInput = z.object({ body: z.string().trim().min(1).max(4000) });
router.use(requireAuth);
function participantFilter(userId) { return { participants: userId }; }

router.get("/experts", async (_req, res) => res.json({ success: true, data: { experts: await User.find({ expertVerified: true, isActive: true, "privacySettings.profileVisible": { $ne: false } }).select("name username profileImageUrl bio expertSpecializations").sort({ name: 1 }).lean() } }));
router.get("/conversations", async (req, res) => res.json({ success: true, data: { conversations: await Conversation.find(participantFilter(req.user._id)).populate("participants", "name username profileImageUrl role expertVerified expertSpecializations").sort({ lastMessageAt: -1 }).lean() } }));
router.post("/conversations", async (req, res) => {
  const targetId = z.string().regex(/^[a-f\d]{24}$/i).safeParse(req.body.userId);
  if (!targetId.success || targetId.data === req.user._id.toString()) return res.status(400).json({ success: false, message: "Choose a valid conversation participant." });
  const target = await User.findOne({ _id: targetId.data, isActive: true }).lean();
  if (!target) return res.status(404).json({ success: false, message: "User not found." });
  const existing = await Conversation.findOne({ participants: { $all: [req.user._id, target._id], $size: 2 } });
  const conversation = existing || await Conversation.create({ participants: [req.user._id, target._id] });
  return res.status(existing ? 200 : 201).json({ success: true, data: { conversation } });
});
router.get("/conversations/:id/messages", async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, ...participantFilter(req.user._id) }).lean();
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found." });
  await Message.updateMany({ conversationId: conversation._id, senderId: { $ne: req.user._id }, readBy: { $ne: req.user._id } }, { $addToSet: { readBy: req.user._id } });
  return res.json({ success: true, data: { messages: await Message.find({ conversationId: conversation._id }).populate("senderId", "name profileImageUrl role").sort({ createdAt: 1 }).limit(500).lean() } });
});
router.post("/conversations/:id/messages", async (req, res) => {
  const parsed = messageInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Message cannot be empty or exceed 4000 characters." });
  const conversation = await Conversation.findOne({ _id: req.params.id, ...participantFilter(req.user._id) });
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found." });
  const message = await Message.create({ conversationId: conversation._id, senderId: req.user._id, body: parsed.data.body, readBy: [req.user._id] });
  conversation.lastMessageAt = new Date();
  await conversation.save();
  return res.status(201).json({ success: true, data: { message } });
});
router.post("/messages/:id/report", async (req, res) => {
  const message = await Message.findById(req.params.id).lean();
  if (!message || !(await Conversation.exists({ _id: message.conversationId, ...participantFilter(req.user._id) }))) return res.status(404).json({ success: false, message: "Message not found." });
  await Message.findByIdAndUpdate(message._id, { reported: true });
  return res.json({ success: true, message: "Message reported." });
});

export default router;