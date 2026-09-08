import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import { connectDatabase } from "../config/database.js";

const email = globalThis.process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run make-admin -- user@example.com");
  globalThis.process.exit(1);
}

try {
  await connectDatabase();
  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true },
  );

  if (!user) {
    throw new Error("No user exists with that email. Register the account first.");
  }

  console.log(`${user.email} is now an administrator.`);
} catch (error) {
  console.error(`Could not grant administrator access: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}