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

  const sampleMarkets = [
    {
      title: "Will Bitcoin reach $100,000 by end of 2025?",
      description:
        "This market resolves to YES if the Coinbase Bitcoin price index closes at or above $100,000 USD on any business day in December 2025.",
      category: "Crypto" as const,
      resolutionDate: new Date("2025-12-31T23:59:59Z"),
      oracleUrl: "https://api.coinbase.com/v2/prices/BTC-USD/spot",
    },
    {
      title: "Will Ethereum Spot ETF be approved by May 2025?",
      description:
        "This market resolves to YES if the U.S. SEC approves at least one spot Ethereum ETF by May 31, 2025.",
      category: "Crypto" as const,
      resolutionDate: new Date("2025-05-31T23:59:59Z"),
      oracleUrl: "https://www.sec.gov",
    },
    {
      title: "Will Donald Trump win the 2024 U.S. Presidential Election?",
      description:
        "This market resolves to YES if Donald Trump wins the majority of electoral votes in the 2024 election.",
      category: "Politics" as const,
      resolutionDate: new Date("2024-11-05T23:59:59Z"),
      oracleUrl: "https://www.fec.gov",
    },
    {
      title: "Will the Fed cut interest rates in June 2025?",
      description:
        "This market resolves to YES if the Federal Reserve lowers the target range for the federal funds rate at any FOMC meeting between June 1 and June 30, 2025.",
      category: "Economics" as const,
      resolutionDate: new Date("2025-06-30T23:59:59Z"),
      oracleUrl: "https://www.federalreserve.gov",
    },
  ];

  let created = 0;
  for (const m of sampleMarkets) {
    const existing = await prisma.market.findFirst({ where: { title: m.title } });
    if (existing) {
      console.log(`Market already exists: ${m.title}`);
      continue;
    }
    const market = await prisma.market.create({
      data: {
        ...m,
        status: "ACTIVE",
        creatorId: admin.id,
        outcomes: {
          create: [
            { label: "YES" },
            { label: "NO" },
          ],
        },
      },
    });
    created++;
    console.log(`Seeded market: ${market.title} (id=${market.id})`);
  }
  console.log(`Seeded ${created} new market(s)`);
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
