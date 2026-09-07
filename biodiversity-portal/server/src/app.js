import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON requests
app.use(
  express.json({
    limit: "10kb",
  })
);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Biodiversity Portal API is running",
  });
});

export default app;