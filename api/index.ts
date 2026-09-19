import express from "express";

const app = express();

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ResolveAI",
    environment: "vercel",
  });
});

export default app;