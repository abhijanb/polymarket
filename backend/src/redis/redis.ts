import { createClient } from "redis";

const url = process.env.REDIS_URL ?? "redis://localhost:6379";

const client = createClient({ url });

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

await client.connect();

export const redis = client;
