import { z } from "zod";

export const placeOrderSchema = z.object({
  marketId: z.string().cuid(),
  side: z.enum(["YES", "NO"]),
  amountUsd: z.number().positive().max(100000),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
