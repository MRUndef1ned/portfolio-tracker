export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

function toLogLine(level: LogLevel, message: string, context?: LogContext): string {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context ?? null
  });
}

export function createLogger(): Logger {
  return {
    debug(message, context) {
      console.debug(toLogLine("debug", message, context));
    },
    info(message, context) {
      console.info(toLogLine("info", message, context));
    },
    warn(message, context) {
      console.warn(toLogLine("warn", message, context));
    },
    error(message, context) {
      console.error(toLogLine("error", message, context));
    }
  };
}
