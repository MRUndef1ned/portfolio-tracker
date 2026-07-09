export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
    public readonly details?: unknown[]
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    super("NOT_FOUND", id ? `${resource} ${id} not found` : `${resource} not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown[]) {
    super("VALIDATION_ERROR", message, 400, details);
  }
}
