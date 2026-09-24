/**
 * Express 5 Application Setup
 * Configured with helmet, cors, json parser, and errorHandler
 * Follows ARCHITECTURE.md §5 and §11
 */

import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { visitorRoutes } from "./routes/visitors.routes";
import { appointmentRoutes } from "./routes/appointments.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app: Application = express();

// Security headers per RULES.md §10
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Mount Routes
app.use("/api/visitors", visitorRoutes);
app.use("/api/appointments", appointmentRoutes);

// Global Error Handler per RULES.md §6
app.use(errorHandler);
