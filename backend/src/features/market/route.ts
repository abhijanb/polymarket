import express from "express";
import { getMarketData } from "./controllers/getMarketData";
import { getMarketDataById } from "./controllers/getMarketDataById";
import { storeMarketData } from "./controllers/storeMarketData";
import { updateMarketData } from "./controllers/updateMarketData";
import { deleteMarketData } from "./controllers/deleteMarketData";
import { authMiddleware } from "../../middlewares/auth";

export const marketRouter = express.Router();
marketRouter.get("/", getMarketData);
marketRouter.get("/:id", getMarketDataById);
marketRouter.post("/", authMiddleware, storeMarketData);
marketRouter.put("/:id", authMiddleware, updateMarketData);
marketRouter.delete("/:id", authMiddleware, deleteMarketData);
