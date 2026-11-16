import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = globalThis.process.env.MONGODB_URI;
  if (!uri || uri.includes("<db_") || uri.includes("<password>")) {
    throw new Error(
      "MONGODB_URI is missing or still contains a placeholder. Replace it in server/.env with your real MongoDB Atlas connection string.",
    );
  }

  let connectionUrl;
  try {
    connectionUrl = new URL(uri);
  } catch {
    if (!uri.startsWith("mongodb://") || !uri.includes("@") || !uri.includes("/")) {
      throw new Error(
        "MONGODB_URI is incomplete or malformed. Copy the full connection string from MongoDB Atlas > Connect > Drivers and Client Libraries.",
      );
    }
    connectionUrl = { username: "configured", password: "configured", hostname: "configured", searchParams: new URLSearchParams(uri.split("?")[1] || "") };
  }

  if (!connectionUrl.username || !connectionUrl.password || !connectionUrl.hostname) {
    throw new Error(
      "MONGODB_URI must include the database username, password and Atlas hostname. Do not leave any part of the Atlas connection string out.",
    );
  }

  const dnsServers = String(globalThis.process.env.MONGODB_DNS_SERVERS || "")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);
  if (dnsServers.length) {
    dns.setServers(dnsServers);
    dnsPromises.setServers(dnsServers);
  }

  await mongoose.connect(uri, {
    authSource: connectionUrl.searchParams.get("authSource") || "admin",
    serverSelectionTimeoutMS: Number(globalThis.process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 10000,
  });
  console.log("MongoDB connected");
}