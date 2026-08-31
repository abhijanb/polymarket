import express from "express";
import { getMarketData } from "./controllers/getMarketData";
import { getMarketDataById } from "./controllers/getMarketDataById";
import { storeMarketData } from "./controllers/storeMarketData";
import { updateMarketData } from "./controllers/updateMarketData";
import { deleteMarketData } from "./controllers/deleteMarketData";
import { authMiddleware } from "../../middlewares/auth";
import { createMarketSchema } from "./validation/market.schema";
import { updateMarketSchema } from "./validation/market.schema";
import validationMiddleware from "../../utils/validationMiddleware.js";

export const marketRouter = express.Router();
marketRouter.get("/", getMarketData);
marketRouter.get("/:id", getMarketDataById);
marketRouter.post("/", authMiddleware, validationMiddleware(createMarketSchema), storeMarketData);
marketRouter.put("/:id", authMiddleware, validationMiddleware(updateMarketSchema), updateMarketData);
marketRouter.delete("/:id", authMiddleware, deleteMarketData);
