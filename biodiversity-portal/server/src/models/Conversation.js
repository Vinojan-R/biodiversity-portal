import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  subject: { type: String, trim: true, maxlength: 160 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reported: { type: Boolean, default: false, index: true },
  lastMessageAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

conversationSchema.index({ participants: 1, lastMessageAt: -1 });
export default mongoose.model("Conversation", conversationSchema);