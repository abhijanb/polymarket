import { startSocket } from "abhijanb";
import express from "express";
import { authRouter } from "./src/auth/route";
import { errorHandler } from "./src/middlewares/errorHandler";

const app = express();

// Built-in parsers — needed before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes — Express 5 handles async handlers natively, no wrapper needed
// Example: authRouter.post("/login", async (req,res) => { throw/reject -> next(err) })
app.use("/api/auth", authRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Global error handler — MUST be after all routes
// Catches both sync throws and async rejections from Express 5 handlers
app.use(errorHandler);

const { server } = startSocket(app);
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});