import { z } from "zod";

export const createMarketSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  category: z.enum(["Crypto", "Politics", "Economics", "Sports", "Science"]),
  resolutionDate: z.string().datetime(),
  oracleUrl: z.string().url(),
});

export const updateMarketSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  category: z.enum(["Crypto", "Politics", "Economics", "Sports", "Science"]).optional(),
  resolutionDate: z.string().datetime().optional(),
  oracleUrl: z.string().url().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "RESOLVED", "CLOSED"]).optional(),
  resolvedOutcomeId: z.string().cuid().optional(),
});

export type CreateMarketInput = z.infer<typeof createMarketSchema>;
export type UpdateMarketInput = z.infer<typeof updateMarketSchema>;
