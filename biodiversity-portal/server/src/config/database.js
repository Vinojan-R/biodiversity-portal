import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = globalThis.process.env.MONGODB_URI;
  if (!uri || uri.includes("<db_") || uri.includes("<password>")) {
    throw new Error(
      "MONGODB_URI is missing or still contains a placeholder. Replace it in server/.env with your real MongoDB Atlas connection string.",
    );
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}