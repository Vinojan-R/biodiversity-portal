import "dotenv/config";
import argon2 from "argon2";
import mongoose from "mongoose";
import User from "../models/User.js";
import { connectDatabase } from "../config/database.js";

const email = globalThis.process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = globalThis.process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before running seed:admin.");
  globalThis.process.exit(1);
}

try {
  await connectDatabase();
  const existing = await User.findOne({ email }).select("+passwordHash");
  if (existing) {
    existing.role = "admin";
    existing.isActive = true;
    await existing.save();
    console.log(`${email} already existed and is now an administrator.`);
  } else {
    await User.create({ name: "Portal Administrator", email, passwordHash: await argon2.hash(password), role: "admin", isEmailVerified: true });
    console.log(`${email} development administrator created.`);
  }
} catch (error) {
  console.error(`Admin seed failed: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}