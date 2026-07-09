import { loadConfig } from "@portfolio-tracker/config/env";
import { createLogger } from "@portfolio-tracker/shared/logger";
import { createApp } from "./app";
import { closeDatabaseConnection, openDatabaseConnection } from "./database/connection";
import { AppServices } from "./services/app-services";

const config = loadConfig();
const logger = createLogger();
const connection = openDatabaseConnection(config, logger);
const services = new AppServices(connection.db);

const { start } = createApp(config, logger, services, connection.db);
const server = start();

function shutdown(): void {
  logger.info("api_shutdown_started");
  server.close(() => {
    closeDatabaseConnection();
    logger.info("api_shutdown_complete");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
