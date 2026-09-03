import { prisma } from "../../../lib/prisma";
import { comparePassword, hashPassword } from "abhijanb";
import { logger } from "../../../lib/logger";

export async function validateUser(email: string, plainPassword: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    logger.warn("auth.validateUser.not_found", { email });
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }
  const ok = await comparePassword(plainPassword, user.password);
  if (!ok) {
    logger.warn("auth.validateUser.bad_password", { email, userId: user.id });
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }
  logger.debug("auth.validateUser.ok", { userId: user.id, role: user.role });
  return user;
}

export async function createUser(data: { email: string; password: string; name?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    logger.warn("auth.createUser.duplicate", { email: data.email });
    throw Object.assign(new Error("User already exists"), { status: 409 });
  }
  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
    },
  });
  logger.info("auth.createUser.created", { userId: user.id, email: user.email, role: user.role });
  return user;
}
