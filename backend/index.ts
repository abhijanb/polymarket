import { startSocket } from "abhijanb";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./src/features/auth/route";
import { userRouter } from "./src/features/user/route";
import { adminRouter } from "./src/features/admin/route";
import { marketRouter } from "./src/features/market/route";
import { meController } from "./src/features/auth/controller/meController";
import { errorHandler } from "./src/middlewares/errorHandler";
import { requestId } from "./src/middlewares/requestId";
import { httpLogger } from "./src/middlewares/httpLogger";
import { prisma } from "./src/lib/prisma";
import { logger } from "./src/lib/logger";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

app.use(requestId);
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
app.use(httpLogger);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/markets", marketRouter);

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    logger.error("health.db_disconnected", { db: "disconnected" }, err);
    res.status(503).json({ ok: false, db: "disconnected" });
  }
});

app.get("/api/me", meController);

app.use(errorHandler);

const { server } = startSocket(app);
server.listen(PORT, () => {
  logger.info("server.start", { port: PORT });
});

const shutdown = async (signal: string) => {
  logger.info("server.shutdown", { signal });
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  logger.error("process.unhandled_rejection", {}, reason);
});
process.on("uncaughtException", (err) => {
  logger.error("process.uncaught_exception", {}, err);
});
