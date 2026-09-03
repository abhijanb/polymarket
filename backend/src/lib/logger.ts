import { AsyncLocalStorage } from "node:async_hooks";

type Level = "debug" | "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  userId?: string;
  route?: string;
}

export interface LoggerBindings {
  [key: string]: unknown;
}

const als = new AsyncLocalStorage<LogContext>();

const LEVEL_RANK: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const minLevel: Level =
  (process.env.LOG_LEVEL as Level) || (process.env.NODE_ENV === "production" ? "info" : "debug");

function nowIso(): string {
  return new Date().toISOString();
}

function shouldLog(level: Level): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[minLevel];
}

function safeStringify(value: unknown): string {
  const seen = new WeakSet<object>();
  return JSON.stringify(value, (_k, v) => {
    if (typeof v === "bigint") return v.toString();
    if (v instanceof Error) {
      return {
        name: v.name,
        message: v.message,
        stack: process.env.NODE_ENV === "production" ? undefined : v.stack,
      };
    }
    if (v && typeof v === "object") {
      if (seen.has(v as object)) return "[Circular]";
      seen.add(v as object);
    }
    return v;
  });
}

function formatError(err: unknown): unknown {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    };
  }
  return err;
}

function emit(level: Level, event: string, data?: LoggerBindings, err?: unknown) {
  if (!shouldLog(level)) return;
  const ctx = als.getStore() ?? {};
  const payload: Record<string, unknown> = {
    time: nowIso(),
    level,
    event,
    ...ctx,
    ...(data ?? {}),
  };
  if (err !== undefined) payload.err = formatError(err);
  const line = safeStringify(payload);
  if (level === "error" || level === "warn") {
    console.error(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug(event: string, data?: LoggerBindings, err?: unknown) {
    emit("debug", event, data, err);
  },
  info(event: string, data?: LoggerBindings, err?: unknown) {
    emit("info", event, data, err);
  },
  warn(event: string, data?: LoggerBindings, err?: unknown) {
    emit("warn", event, data, err);
  },
  error(event: string, data?: LoggerBindings, err?: unknown) {
    emit("error", event, data, err);
  },
};

export function getRequestContext(): LogContext | undefined {
  return als.getStore();
}

export function runWithContext<T>(ctx: LogContext, fn: () => T): T {
  return als.run({ ...(als.getStore() ?? {}), ...ctx }, fn);
}

export function updateContext(patch: Partial<LogContext>): void {
  const current = als.getStore();
  if (current) Object.assign(current, patch);
}
