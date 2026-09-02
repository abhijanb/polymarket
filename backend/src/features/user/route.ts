import express from "express";
import { getPortfolioController } from "./controller/getPortfolio";
import { authMiddleware } from "../../middlewares/auth";
import { orderRouter } from "../order/route";

export const userRouter = express.Router();

userRouter.get("/portfolio", authMiddleware, getPortfolioController);
userRouter.use("/orders", orderRouter);
