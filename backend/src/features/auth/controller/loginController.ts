import type { Request, Response } from "express";
import { loginSchema } from "../validation/auth.schema";
import { validateUser } from "../service/auth.service";
import { signAccessToken } from "../../../utils/jwt";
import { validate } from "../../../utils/validate";

export async function loginController(req: Request, res: Response) {
  const result = validate(loginSchema, req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.errors,
    });
  }
  const { email, password } = result.data ;

  // Validate credentials — throws 401 on failure (caught by Express 5)
  const user = await validateUser(email, password);

  const token = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Set httpOnly cookie for web clients, also return JSON for mobile/API
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