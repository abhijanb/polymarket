import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "abhijanb";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@polymarket.local";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL/ADMIN_PASSWORD is required");
  }

  const hashed = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, password: hashed, role: "ADMIN" as const },
    create: { email, name, password: hashed, role: "ADMIN" as const },
  });

  console.log(`Seeded admin: ${admin.email} (${admin.role}) id=${admin.id}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
