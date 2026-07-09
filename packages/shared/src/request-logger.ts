import type { Logger } from "./logger";

export interface RequestLike {
  method: string;
  path: string;
}

export interface ResponseLike {
  statusCode: number;
}

export type NextLike = () => void;

/**
 * Framework-agnostic request logger middleware stub.
 * This can be adapted to Express in Execution-013.
 */
export function requestLogger(logger: Logger) {
  return (req: RequestLike, res: ResponseLike, next: NextLike): void => {
    const start = Date.now();
    next();
    const durationMs = Date.now() - start;

    logger.info("http_request", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs
    });
  };
}
