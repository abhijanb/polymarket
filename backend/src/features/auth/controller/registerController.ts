import type { Request, Response } from "express";
import { registerSchema } from "../validation/auth.schema";
import { createUser } from "../service/auth.service";
import { signAccessToken } from "../../../utils/jwt";

export async function registerController(req: Request, res: Response) {
  const { email, password, name } = req.body;

  const user = await createUser({ email, password, name });

  const token = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
