import { startSocket } from "abhijanb";
import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./src/auth/route";
import { errorHandler } from "./src/middlewares/errorHandler";
import { prisma } from "./src/lib/prisma";

const app = express();

// Built-in parsers — needed before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes — Express 5 handles async handlers natively, no wrapper needed
// Example: authRouter.post("/login", async (req,res) => { throw/reject -> next(err) })
app.use("/api/auth", authRouter);

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "connected" });
  } catch {
    res.status(503).json({ ok: false, db: "disconnected" });
  }
});

// Global error handler — MUST be after all routes
// Catches both sync throws and async rejections from Express 5 handlers
app.use(errorHandler);

const { server } = startSocket(app);
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Graceful shutdown — disconnect Prisma
const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);