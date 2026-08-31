import { z } from "zod";

export const createMarketSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or fewer"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["Crypto", "Politics", "Economics", "Sports", "Science"], { error: "Category is required" }),
  resolutionDate: z.string().min(1, "Resolution date is required").datetime("Invalid date/time format"),
  oracleUrl: z.string().url("Enter a valid URL"),
});

export type CreateMarketInput = z.infer<typeof createMarketSchema>;

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
