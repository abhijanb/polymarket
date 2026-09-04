import express from "express";
import { getMarketsController } from "./controller/getMarkets";

export const marketRouter = express.Router();

marketRouter.get("/", getMarketsController);
