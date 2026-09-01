import express from "express";
import { getPortfolioController } from "./controller/getPortfolio";
import { getDashboardMarketsController } from "../dashboard/controllers/getDashboardMarkets";
import { authMiddleware } from "../../middlewares/auth";
import { orderRouter } from "../order/route";

export const userRouter = express.Router();

userRouter.get("/portfolio", authMiddleware, getPortfolioController);
userRouter.get("/dashboard/markets", authMiddleware, getDashboardMarketsController);
userRouter.use("/orders", orderRouter);
