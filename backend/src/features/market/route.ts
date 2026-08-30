import express from "express";
import { getMarketData } from "./controllers/getMarketData";
import { getMarketDataById } from "./controllers/getMarketDataById";
import { storeMarketData } from "./controllers/storeMarketData";
import { updateMarketData } from "./controllers/updateMarketData";
import { deleteMarketData } from "./controllers/deleteMarketData";
import { authMiddleware } from "../../middlewares/auth";

export const marketRouter = express.Router();
marketRouter.get("/market", getMarketData);
marketRouter.get("/market/:id", getMarketDataById);
marketRouter.post("/market", authMiddleware, storeMarketData);
marketRouter.put("/market/:id", authMiddleware, updateMarketData);
marketRouter.delete("/market/:id", authMiddleware, deleteMarketData);
