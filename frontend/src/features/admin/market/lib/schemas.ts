import { z } from "zod";

export const updateMarketSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  category: z.enum(["Crypto", "Politics", "Economics", "Sports", "Science"]).optional(),
  resolutionDate: z.string().datetime().optional(),
  oracleUrl: z.string().url().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "RESOLVED", "CLOSED"]).optional(),
  resolvedOutcomeId: z.string().cuid().optional(),
});

export type UpdateMarketInput = z.infer<typeof updateMarketSchema>;
