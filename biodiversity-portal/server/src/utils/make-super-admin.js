import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import { connectDatabase } from "../config/database.js";

const email = (globalThis.process.argv[2] || "").trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run make-super-admin -- user@example.com");
  globalThis.process.exit(1);
}

try {
  await connectDatabase();
  const user = await User.findOneAndUpdate(
    { email },
    { role: "SUPER_ADMIN", isActive: true },
    { new: true, runValidators: true },
  );
  if (!user) throw new Error("No user exists with that email. Register the account first.");
  console.log(`${user.email} is now the Super Admin.`);
} catch (error) {
  console.error(`Could not grant Super Admin access: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
