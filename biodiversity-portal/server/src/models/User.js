import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    username: { type: String, trim: true, lowercase: true, minlength: 3, maxlength: 40, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true, select: false },
    profileImageUrl: { type: String, trim: true, maxlength: 500 },
    bio: { type: String, trim: true, maxlength: 500 },
    country: { type: String, trim: true, maxlength: 80 },
    city: { type: String, trim: true, maxlength: 80 },
    privacySettings: {
      profileVisible: { type: Boolean, default: true },
      findingsVisible: { type: Boolean, default: false },
      locationVisible: { type: Boolean, default: false },
    },
    notificationSettings: {
      emailNotifications: { type: Boolean, default: true },
      securityNotifications: { type: Boolean, default: true },
      activityNotifications: { type: Boolean, default: true },
    },
    adminPermissions: [{ type: String, trim: true }],
    expertVerified: { type: Boolean, default: false },
    expertSpecializations: [{ type: String, trim: true, maxlength: 120 }],
    role: { type: String, enum: ["USER", "CONTRIBUTOR", "MODERATOR", "ADMIN", "SUPER_ADMIN", "RESEARCHER", "user", "admin", "researcher"], default: "USER" },
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