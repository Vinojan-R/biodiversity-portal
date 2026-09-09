import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import adminContentRoutes from "./routes/adminContent.js";
import speciesRoutes from "./routes/species.js";
import observationRoutes from "./routes/observations.js";

const app = express();
const allowedOrigins = new Set([
  globalThis.process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean));

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
  })
);

// Parse JSON requests
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  session({
    name: "biodiversity.sid",
    secret: globalThis.process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: globalThis.process.env.MONGODB_URI?.includes("<db_")
      ? undefined
      : MongoStore.create({ mongoUrl: globalThis.process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: globalThis.process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/species", speciesRoutes);
app.use("/api/observations", observationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminContentRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Biodiversity Portal API is running",
  });
});

app.use((error, _req, res, _next) => {
  void _next;
  console.error("API error:", error.message);
  return res.status(error.statusCode || 500).json({
    success: false,
    message: "The server could not complete that request.",
  });
});

export default app;