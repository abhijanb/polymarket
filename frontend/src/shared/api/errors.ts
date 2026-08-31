import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type ApiFieldError = { field: string; message: string; code?: string };
type ApiErrorData = { success?: boolean; message?: string; errors?: ApiFieldError[] };

export function isFetchBaseQueryError(err: unknown): err is FetchBaseQueryError {
  return typeof err === "object" && err !== null && "status" in err;
}

export function extractFieldErrors(err: unknown): Record<string, string> {
  if (!isFetchBaseQueryError(err)) return {};

  const status = err.status;
  if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR" || status === "PARSING_ERROR") {
    return {};
  }

  const data = err.data as ApiErrorData | undefined;
  if (!data || !Array.isArray(data.errors)) return {};

  const fieldErrors: Record<string, string> = {};
  for (const e of data.errors) {
    if (e && e.field) fieldErrors[e.field] = e.message;
  }
  return fieldErrors;
}

export function toApiDatetime(value: string): string {
  if (!value) return value;
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
}
