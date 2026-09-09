import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true, trim: true },
    targetType: { type: String, required: true, trim: true },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

auditLogSchema.index({ createdAt: -1 });
export default mongoose.model("AuditLog", auditLogSchema);