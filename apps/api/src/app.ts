import express from "express";
import cors from "cors";
import type { AppConfig } from "@portfolio-tracker/config/env";
import type { Logger } from "@portfolio-tracker/shared/logger";
import { errorResponse } from "@portfolio-tracker/shared/api-types";
import type Database from "better-sqlite3";
import { errorHandler } from "./middleware/error-handler";
import { requestContext } from "./middleware/request-context";
import { createApiRouter } from "./routes/api-router";
import type { AppServices } from "./services/app-services";

export function createApp(
  config: AppConfig,
  logger: Logger,
  services: AppServices,
  db: Database.Database
) {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(requestContext(logger));

  app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error instanceof SyntaxError) {
      res.status(400).json(errorResponse("INVALID_JSON", "Malformed JSON body"));
      return;
    }
    next(error);
  });

  app.use("/api/v1", createApiRouter(services, db));

  app.use((_req, res) => {
    res.status(404).json(errorResponse("NOT_FOUND", "Route not found"));
  });

  app.use(errorHandler);

  return {
    app,
    start: () =>
      app.listen(config.API_PORT, config.API_HOST, () => {
        logger.info("api_server_started", {
          host: config.API_HOST,
          port: config.API_PORT
        });
      })
  };
}
