import { z } from "zod";

export const placeOrderFormSchema = z.object({
  outcome: z.enum(["YES", "NO"]),
  shares: z.coerce.number().int().positive().max(1_000_000),
  pricePerShareCents: z.coerce.number().int().positive().max(9999),
});

export type PlaceOrderFormInput = z.infer<typeof placeOrderFormSchema>;
