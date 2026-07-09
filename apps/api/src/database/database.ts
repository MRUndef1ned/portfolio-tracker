import type { AppConfig } from "@portfolio-tracker/config/env";
import type { Logger } from "@portfolio-tracker/shared/logger";
import {
  closeDatabaseConnection,
  getDatabase,
  openDatabaseConnection,
  type DatabaseConnection
} from "./connection";

export interface DatabaseHandle {
  db: ReturnType<typeof getDatabase>;
  close: () => void;
}

export function initializeDatabase(config: AppConfig, logger: Logger): DatabaseHandle {
  const connection = openDatabaseConnection(config, logger);

  return {
    db: connection.db,
    close: () => closeDatabaseConnection()
  };
}

export type { DatabaseConnection };
