import { prisma } from "../../../lib/prisma";
import { comparePassword, hashPassword } from "abhijanb";

export async function validateUser(email: string, plainPassword: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }
  const ok = await comparePassword(plainPassword, user.password);
  if (!ok) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }
  return user;
}

export async function createUser(data: { email: string; password: string; name?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
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
  return user;
}
