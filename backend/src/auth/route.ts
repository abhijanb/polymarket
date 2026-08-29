import express from "express";
import { loginController } from "./controller/loginController";
import { registerController } from "./controller/registerController";
import { logoutController } from "./controller/logoutController";

export const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);