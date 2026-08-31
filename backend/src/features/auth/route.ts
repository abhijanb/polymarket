import express from "express";
import { loginController } from "./controller/loginController";
import { registerController } from "./controller/registerController";
import { logoutController } from "./controller/logoutController";
import { loginSchema } from "./validation/auth.schema";
import { registerSchema } from "./validation/auth.schema";
import validationMiddleware from "../../utils/validationMiddleware.js";

export const authRouter = express.Router();

authRouter.post("/register", validationMiddleware(registerSchema), registerController);
authRouter.post("/login", validationMiddleware(loginSchema), loginController);
authRouter.post("/logout", logoutController);