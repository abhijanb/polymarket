import express from "express";
import { marketRouter } from "../market/route";
import { getUsersController } from "../user/controller/getUsers";
import { authMiddleware } from "../../middlewares/auth";
import { requireAdmin } from "../../middlewares/requireAdmin";

export const adminRouter = express.Router();

adminRouter.use("/markets", authMiddleware, requireAdmin, marketRouter);
adminRouter.get("/users", authMiddleware, requireAdmin, getUsersController);
