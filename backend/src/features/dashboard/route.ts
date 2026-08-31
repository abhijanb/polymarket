import express from "express";
import { getDashboardMarketsController } from "./controllers/getDashboardMarkets";
import { authMiddleware } from "../../middlewares/auth";

export const dashboardRouter = express.Router();

dashboardRouter.get("/markets", authMiddleware, getDashboardMarketsController);
