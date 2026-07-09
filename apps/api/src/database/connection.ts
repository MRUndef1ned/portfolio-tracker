import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { AppConfig } from "@portfolio-tracker/config/env";
import type { Logger } from "@portfolio-tracker/shared/logger";
import { runMigrations } from "./migrations/runner";

export interface DatabaseConnection {
  db: Database.Database;
}

let activeConnection: DatabaseConnection | null = null;

function ensureDbDirectory(dbPath: string): void {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

function applyPragmas(db: Database.Database): void {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
}

export function openDatabaseConnection(config: AppConfig, logger: Logger): DatabaseConnection {
  if (activeConnection) {
    return activeConnection;
  }

  ensureDbDirectory(config.DB_PATH);

  const db = new Database(config.DB_PATH);
  applyPragmas(db);

  const applied = runMigrations(db, logger);

  activeConnection = { db };

  logger.info("database_connection_opened", {
    dbPath: config.DB_PATH,
    journalMode: db.pragma("journal_mode", { simple: true }),
    foreignKeys: db.pragma("foreign_keys", { simple: true }),
    migrationsAppliedThisRun: applied.length
  });

  return activeConnection;
}

export function getDatabaseConnection(): DatabaseConnection {
  if (!activeConnection) {
    throw new Error("Database connection is not initialized. Call openDatabaseConnection() first.");
  }

  return activeConnection;
}

export function getDatabase(): Database.Database {
  return getDatabaseConnection().db;
}

export function closeDatabaseConnection(): void {
  if (!activeConnection) {
    return;
  }

  activeConnection.db.close();
  activeConnection = null;
}

export function runInTransaction<T>(fn: (db: Database.Database) => T): T {
  const db = getDatabase();
  const transaction = db.transaction(() => fn(db));
  return transaction();
}
