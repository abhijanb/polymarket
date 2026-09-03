import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "abhijanb";

interface SeedProduct {
  name: string;
  description: string;
  category: "Crypto" | "Politics" | "Economics" | "Sports" | "Science";
  status: "DRAFT" | "ACTIVE" | "RESOLVED";
  outcome: "YES" | "NO" | null;
  outcomeOffsetDays: number;
}

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

  const sampleProducts: SeedProduct[] = [
    {
      name: "Will Bitcoin reach $150,000 by end of 2026?",
      description:
        "[Crypto] Resolves YES if the Coinbase BTC-USD spot index closes at or above $150,000 on any business day in December 2026.",
      category: "Crypto",
      status: "ACTIVE",
      outcome: null,
      outcomeOffsetDays: 120,
    },
    {
      name: "Will Ethereum hit $10,000 in 2026?",
      description:
        "[Crypto] Resolves YES if ETH-USD closes at or above $10,000 on any Coinbase spot print in 2026.",
      category: "Crypto",
      status: "ACTIVE",
      outcome: null,
      outcomeOffsetDays: 200,
    },
    {
      name: "Will the U.S. Fed cut rates before Q3 2026?",
      description:
        "[Economics] Resolves YES if the FOMC lowers the target federal funds range at any meeting before September 30, 2026.",
      category: "Economics",
      status: "ACTIVE",
      outcome: null,
      outcomeOffsetDays: 90,
    },
    {
      name: "Will there be a U.S. government shutdown in 2026?",
      description:
        "[Politics] Resolves YES if any federal agency experiences a funding lapse lasting 24+ hours in calendar year 2026.",
      category: "Politics",
      status: "ACTIVE",
      outcome: null,
      outcomeOffsetDays: 180,
    },
    {
      name: "Will SpaceX achieve a crewed Mars flyby by 2030?",
      description:
        "[Science] Resolves YES if a SpaceX vehicle carrying a crew completes a Mars flyby maneuver before January 1, 2030.",
      category: "Science",
      status: "ACTIVE",
      outcome: null,
      outcomeOffsetDays: 1200,
    },
    {
      name: "Will the 2026 FIFA World Cup final go to extra time?",
      description:
        "[Sports] Resolves YES if the 2026 World Cup final is tied at the end of regular time and goes to extra time.",
      category: "Sports",
      status: "ACTIVE",
      outcome: null,
      outcomeOffsetDays: 200,
    },
    {
      name: "Will Apple release a foldable iPhone in 2026?",
      description:
        "[Science] Resolves YES if Apple ships a consumer foldable iPhone (any form factor) in calendar year 2026.",
      category: "Science",
      status: "DRAFT",
      outcome: null,
      outcomeOffsetDays: 250,
    },
    {
      name: "Will the UK hold a general election in 2026?",
      description:
        "[Politics] Resolves YES if a UK general election polling day occurs in calendar year 2026.",
      category: "Politics",
      status: "DRAFT",
      outcome: null,
      outcomeOffsetDays: 250,
    },
    {
      name: "Did the SEC approve a spot SOL ETF in 2025?",
      description:
        "[Crypto] Resolves YES if the U.S. SEC approved at least one spot Solana ETF in 2025. Resolved as YES.",
      category: "Crypto",
      status: "RESOLVED",
      outcome: "YES",
      outcomeOffsetDays: -90,
    },
    {
      name: "Did global temperatures set a new record in 2025?",
      description:
        "[Science] Resolves YES if 2025 was the warmest year on record per NOAA/NASA. Resolved as NO.",
      category: "Science",
      status: "RESOLVED",
      outcome: "NO",
      outcomeOffsetDays: -60,
    },
  ];

  const now = Date.now();
  let created = 0;
  let skipped = 0;
  for (const p of sampleProducts) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) {
      console.log(`Product already exists: ${p.name}`);
      skipped++;
      continue;
    }
    const outcomeTime = new Date(now + p.outcomeOffsetDays * 24 * 60 * 60 * 1000);
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        status: p.status,
        outcome: p.outcome,
        outcomeTime,
        creatorId: admin.id,
      },
    });
    created++;
    console.log(
      `Seeded product: ${product.name} (${product.status}${p.outcome ? `/${p.outcome}` : ""}) id=${product.id}`
    );
  }
  console.log(`Seeded ${created} new product(s), ${skipped} already existed.`);
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
