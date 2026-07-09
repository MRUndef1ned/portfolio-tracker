import type { Request, Response } from "express";
import { AppError } from "@portfolio-tracker/shared/errors";
import { errorResponse } from "@portfolio-tracker/shared/api-types";

export function errorHandler(error: unknown, _req: Request, res: Response): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      errorResponse(error.code, error.message, error.details)
    );
    return;
  }

  res.status(500).json(errorResponse("INTERNAL_ERROR", "Unexpected server error"));
}
