import express from "express";
import { loginController } from "./controller/loginController";

export const authRouter = express.Router();

authRouter.post("/login", loginController);