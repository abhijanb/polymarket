import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
  name: z.string().min(1).max(100).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
