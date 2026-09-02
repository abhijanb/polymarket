import express from "express";
import { getUsersController } from "./controller/getUsers";
import { authMiddleware } from "../../middlewares/auth";
import { requireAdmin } from "../../middlewares/requireAdmin";

export const adminRouter = express.Router();

adminRouter.get("/users", authMiddleware, requireAdmin, getUsersController);
