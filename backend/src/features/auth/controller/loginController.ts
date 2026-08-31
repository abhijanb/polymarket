import type { Request, Response } from "express";
import { loginSchema } from "../validation/auth.schema";
import { validateUser } from "../service/auth.service";
import { signAccessToken } from "../../../utils/jwt";

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await validateUser(email, password);

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

  res.json({
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