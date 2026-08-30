import express from "express";
import { getUsersController } from "./controller/getUsers";
import { authMiddleware } from "../../middlewares/auth";
import { requireAdmin } from "../../middlewares/requireAdmin";

export const userRouter = express.Router();

userRouter.get("/", authMiddleware, requireAdmin, getUsersController);
