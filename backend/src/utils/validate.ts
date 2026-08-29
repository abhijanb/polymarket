import { z } from "zod";
import type { ZodSchema, ZodError } from "zod";

type FormattedError = { field: string; message: string; code: string };

type ValidateResult<T> =
  | { success: true; data: T; errors: null }
  | { success: false; data: null; errors: FormattedError[] };

function formatZodErrors(error: ZodError): FormattedError[] {
  return error.issues.map((issue) => ({
    field: issue.path.length ? issue.path.join(".") : "root",
    message: issue.message,
    code: issue.code,
  }));
}

/** Validate data against Zod schema → { success, data, errors } */
export function validate<T>(schema: ZodSchema<T>, data: unknown): ValidateResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }
  return { success: false, data: null, errors: formatZodErrors(result.error) };
}

export type { ValidateResult };