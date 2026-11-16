import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, trim: true, maxlength: 4000 },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reported: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);