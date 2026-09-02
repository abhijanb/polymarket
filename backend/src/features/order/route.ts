import express from "express";
import { placeOrderController } from "./controller/placeOrder";
import { getOrdersController } from "./controller/getOrders";
import { authMiddleware } from "../../middlewares/auth";
import { placeOrderSchema } from "./validation/order.schema";
import validationMiddleware from "../../utils/validationMiddleware";

export const orderRouter = express.Router();

orderRouter.get("/", authMiddleware, getOrdersController);
orderRouter.post("/", authMiddleware, validationMiddleware(placeOrderSchema), placeOrderController);
