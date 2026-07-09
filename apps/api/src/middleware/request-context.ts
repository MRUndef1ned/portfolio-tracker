import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import type { Logger } from "@portfolio-tracker/shared/logger";

export function requestContext(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const requestId = randomUUID();
    const start = Date.now();

    res.setHeader("x-request-id", requestId);

    res.on("finish", () => {
      logger.info("http_request", {
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - start
      });
    });

    next();
  };
}
