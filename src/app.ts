import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiEndpointRouter from "./routes/routes";

import "./jobs/monitor-jobs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/health", apiEndpointRouter);

//Root route: Health check route for testing
app.get("/", (req: Request, res: Response) => {
  return res.json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Error:", err);
  return res.status(500).json({ error: "Internal server error: " + err });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`✅ Try visiting: http://localhost:${PORT}/`);
});
