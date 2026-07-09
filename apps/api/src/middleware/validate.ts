import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "@portfolio-tracker/shared/errors";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20)
});

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(new ValidationError("Invalid request body", parsed.error.issues));
      return;
    }
    req.body = parsed.data;
    next();
  };
}

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      next(new ValidationError("Invalid query parameters", parsed.error.issues));
      return;
    }
    Object.assign(req.query, parsed.data);
    next();
  };
}
