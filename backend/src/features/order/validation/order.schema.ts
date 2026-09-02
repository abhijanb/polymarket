import { z } from "zod";

export const placeOrderSchema = z.object({
  productId: z.string().cuid(),
  outcome: z.enum(["YES", "NO"]),
  shares: z.number().int().positive().max(1_000_000),
  pricePerShareCents: z.number().min(0.1).max(99.9),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
