import type { Request, Response } from "express";
import { registerSchema } from "../validation/auth.schema";
import { createUser } from "../service/auth.service";
import { signAccessToken } from "../../../utils/jwt";
import { logger } from "../../../lib/logger";

export async function registerController(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.warn("auth.register.invalid_input", {
      errors: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  const { email, password, name } = parsed.data;
  logger.info("auth.register.start", { email });

  try {
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

    logger.info("auth.register.success", { userId: user.id, email: user.email, role: user.role });

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
  } catch (err: any) {
    logger.warn("auth.register.failure", {
      email,
      reason: err?.message,
      status: err?.status,
    });
    if (err?.status) {
      return res.status(err.status).json({ success: false, message: err.message });
    }
    logger.error("auth.register.error", { email }, err);
    return res.status(500).json({ success: false, message: "Error during registration" });
  }
}
