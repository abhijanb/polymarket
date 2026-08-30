import { startSocket } from "abhijanb";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./src/features/auth/route";
import { marketRouter } from "./src/features/market/route";
import { meController } from "./src/features/auth/controller/meController";
import { errorHandler } from "./src/middlewares/errorHandler";
import { prisma } from "./src/lib/prisma";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

// Built-in parsers — needed before routes
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:3001", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes — Express 5 handles async handlers natively, no wrapper needed
// Example: authRouter.post("/login", async (req,res) => { throw/reject -> next(err) })
app.use("/api/auth", authRouter);
app.use("/api/market", marketRouter);

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "connected" });
  } catch {
    res.status(503).json({ ok: false, db: "disconnected" });
  }
});

app.get("/api/me", meController);

// Global error handler — MUST be after all routes
// Catches both sync throws and async rejections from Express 5 handlers
app.use(errorHandler);

const { server } = startSocket(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown — disconnect Prisma
const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);