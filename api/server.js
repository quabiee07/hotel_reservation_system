import "dotenv/config";
import express from "express";
import cors from "cors";
import { initPool, closePool } from "./db.js";
import availabilityRouter from "./routes/availability.js";
import bookingsRouter from "./routes/bookings.js";
import guestsRouter from "./routes/guests.js";
import checkoutRouter from "./routes/checkout.js";
import auditRouter from "./routes/audit.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    db: process.env.DB_DISABLED === "true" ? "disabled" : "configured",
  });
});

app.use("/api/availability", availabilityRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/guests", guestsRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/audit", auditRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

// Central error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const payload = {
    error: err.message || "Internal server error",
  };
  if (err.code) payload.code = err.code;
  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }
  console.error("[error]", err);
  res.status(status).json(payload);
});

const server = app.listen(port, async () => {
  try {
    await initPool();
  } catch (e) {
    console.error("[db] Failed to initialize pool:", e.message);
  }
  console.log(`[api] listening on http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
