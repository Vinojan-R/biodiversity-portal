import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true, select: false },
    profileImageUrl: { type: String, trim: true, maxlength: 500 },
    role: { type: String, enum: ["USER", "CONTRIBUTOR", "MODERATOR", "ADMIN", "SUPER_ADMIN", "user", "admin", "researcher"], default: "USER" },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    resetOtpHash: { type: String, select: false },
    resetOtpExpiresAt: { type: Date, select: false },
    resetOtpAttempts: { type: Number, select: false, default: 0 },
    resetOtpRequestedAt: { type: Date, select: false },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);