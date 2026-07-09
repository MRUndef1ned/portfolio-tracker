import { loadConfig } from "@portfolio-tracker/config/env";
import { createLogger } from "@portfolio-tracker/shared/logger";
import { closeDatabaseConnection, openDatabaseConnection } from "../connection";
import { getMigrationStatus, runMigrations } from "./runner";

const logger = createLogger();
const config = loadConfig();

const connection = openDatabaseConnection(config, logger);

try {
  const applied = runMigrations(connection.db, logger);
  const status = getMigrationStatus(connection.db);

  logger.info("migration_cli_complete", {
    newlyApplied: applied.length,
    totalApplied: status.length
  });
} finally {
  closeDatabaseConnection();
}
