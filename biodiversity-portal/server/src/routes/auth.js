import argon2 from "argon2";
import crypto from "node:crypto";
import express from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { isEmailConfigured, sendPasswordResetOtp } from "../utils/mailer.js";
import { normalizeRole } from "../utils/permissions.js";

const router = express.Router();
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 15, standardHeaders: true });
const resetLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true });
const credentials = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
});
const registration = credentials.extend({ name: z.string().trim().min(2).max(80) });
const resetRequest = z.object({ email: z.string().trim().email().max(160) });
const resetCompletion = resetRequest.extend({
  otp: z.string().regex(/^\d{6}$/),
  password: z.string().min(8).max(128),
});
const googleConfig = [
  globalThis.process.env.GOOGLE_CLIENT_ID,
  globalThis.process.env.GOOGLE_CLIENT_SECRET,
  globalThis.process.env.GOOGLE_CALLBACK_URL,
];

function hasGoogleConfig() {
  return googleConfig.every((value) => value && !value.includes("your-") && !value.includes("<"));
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: normalizeRole(user.role) };
}

function establishSession(req, userId) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);
      req.session.userId = userId.toString();
      return resolve();
    });
  });
}

router.post("/register", authLimit, async (req, res) => {
  const parsed = registration.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Enter a valid name, email, and password (8-128 characters)." });

  const email = parsed.data.email.toLowerCase();
  const existing = await User.exists({ email });
  if (existing) return res.status(409).json({ message: "An account with that email already exists." });

  const user = await User.create({ ...parsed.data, email, passwordHash: await argon2.hash(parsed.data.password) });
  await establishSession(req, user._id);
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
  return res.status(201).json({ user: publicUser(user) });
});

router.post("/login", authLimit, async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Enter a valid email and password." });

  const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordHash");
  const valid = user && user.isActive && user.passwordHash && await argon2.verify(user.passwordHash, parsed.data.password);
  if (!valid) return res.status(401).json({ message: "Invalid email or password." });

  await establishSession(req, user._id);
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
  return res.json({ user: publicUser(user) });
});

router.post("/logout", (req, res) => req.session.destroy(() => res.status(204).end()));
router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

router.post("/forgot-password", resetLimit, async (req, res) => {
  const parsed = resetRequest.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Enter a valid email address." });
  if (!isEmailConfigured()) return res.status(503).json({ success: false, message: "Password reset email is not configured on the server." });

  const email = parsed.data.email.toLowerCase();
  const user = await User.findOne({ email }).select("+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts +resetOtpRequestedAt");
  if (user) {
    const otp = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    user.resetOtpHash = await argon2.hash(otp);
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.resetOtpAttempts = 0;
    user.resetOtpRequestedAt = new Date();
    await user.save();
    await sendPasswordResetOtp({ email, otp });
  }

  return res.json({ success: true, message: "If an account exists for that email, a reset code has been sent." });
});

router.post("/reset-password", resetLimit, async (req, res) => {
  const parsed = resetCompletion.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Enter your email, six-digit code, and a password of at least 8 characters." });

  const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select("+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts");
  const expired = !user?.resetOtpExpiresAt || user.resetOtpExpiresAt.getTime() < Date.now();
  if (!user || !user.resetOtpHash || expired || user.resetOtpAttempts >= 5) return res.status(400).json({ success: false, message: "That reset code is invalid or expired. Request a new code." });

  const validOtp = await argon2.verify(user.resetOtpHash, parsed.data.otp);
  if (!validOtp) {
    user.resetOtpAttempts += 1;
    await user.save();
    return res.status(400).json({ success: false, message: "That reset code is invalid or expired. Request a new code." });
  }

  user.passwordHash = await argon2.hash(parsed.data.password);
  user.resetOtpHash = undefined;
  user.resetOtpExpiresAt = undefined;
  user.resetOtpAttempts = 0;
  user.resetOtpRequestedAt = undefined;
  await user.save();
  await establishSession(req, user._id);
  return res.json({ success: true, user: publicUser(user) });
});

router.get("/google", (req, res) => {
  const frontendUrl = globalThis.process.env.CLIENT_URL || "http://localhost:5173";
  if (!hasGoogleConfig()) {
    return res.redirect(`${frontendUrl}/login?oauth_error=google_not_configured`);
  }

  const state = crypto.randomBytes(32).toString("hex");
  req.session.googleOAuthState = state;
  const params = new URLSearchParams({
    client_id: globalThis.process.env.GOOGLE_CLIENT_ID,
    redirect_uri: globalThis.process.env.GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get("/google/callback", async (req, res) => {
  const frontendUrl = globalThis.process.env.CLIENT_URL || "http://localhost:5173";
  const { code, state } = req.query;
  if (!code || !state || state !== req.session.googleOAuthState) {
    return res.redirect(`${frontendUrl}/login?oauth_error=invalid_state`);
  }

  delete req.session.googleOAuthState;

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: globalThis.process.env.GOOGLE_CLIENT_ID,
        client_secret: globalThis.process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: globalThis.process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok || !tokens.access_token) throw new Error("Google token exchange failed.");

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.sub || !profile.email || profile.email_verified !== true) {
      throw new Error("Google did not return a verified email address.");
    }

    let user = await User.findOne({ $or: [{ googleId: profile.sub }, { email: profile.email.toLowerCase() }] }).select("+googleId");
    if (user?.googleId && user.googleId !== profile.sub) throw new Error("This email is linked to another Google account.");
    if (user) {
      user.googleId = profile.sub;
      user.isEmailVerified = true;
      user.profileImageUrl = profile.picture;
      if (!user.name && profile.name) user.name = profile.name;
      await user.save();
    } else {
      user = await User.create({ name: profile.name || profile.email.split("@")[0], email: profile.email.toLowerCase(), googleId: profile.sub, profileImageUrl: profile.picture, isEmailVerified: true });
    }

    if (!user.isActive) throw new Error("This account is suspended.");
    await establishSession(req, user._id);
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    return res.redirect(`${frontendUrl}/home`);
  } catch (error) {
    console.error("Google sign-in failed:", error.message);
    return res.redirect(`${frontendUrl}/login?oauth_error=google_signin_failed`);
  }
});

export default router;