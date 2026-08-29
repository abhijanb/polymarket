import express from "express";
import { loginController } from "./controller/loginController";
import { registerController } from "./controller/registerController";

export const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);