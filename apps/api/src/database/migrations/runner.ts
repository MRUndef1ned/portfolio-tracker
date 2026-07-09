import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type Database from "better-sqlite3";
import type { Logger } from "@portfolio-tracker/shared/logger";

export interface MigrationRecord {
  version: string;
  name: string;
  applied_at: string;
  checksum: string;
}

const MIGRATIONS_DIR = path.dirname(fileURLToPath(import.meta.url));

export function ensureMigrationsTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now')),
      checksum TEXT NOT NULL
    );
  `);
}

function listMigrationFiles(): string[] {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

function getAppliedVersions(db: Database.Database): Set<string> {
  const rows = db
    .prepare("SELECT version FROM schema_migrations ORDER BY version ASC")
    .all() as Array<{ version: string }>;

  return new Set(rows.map((row) => row.version));
}

function applyMigration(
  db: Database.Database,
  fileName: string,
  sql: string,
  checksum: string
): void {
  const version = fileName.split("_")[0] ?? fileName;

  const apply = db.transaction(() => {
    db.exec(sql);
    db.prepare(
      `INSERT INTO schema_migrations (version, name, checksum)
       VALUES (?, ?, ?)`
    ).run(version, fileName, checksum);
  });

  apply();
}

export function runMigrations(db: Database.Database, logger: Logger): MigrationRecord[] {
  ensureMigrationsTable(db);

  const appliedVersions = getAppliedVersions(db);
  const newlyApplied: MigrationRecord[] = [];

  for (const fileName of listMigrationFiles()) {
    const version = fileName.split("_")[0] ?? fileName;

    if (appliedVersions.has(version)) {
      continue;
    }

    const filePath = path.join(MIGRATIONS_DIR, fileName);
    const sql = fs.readFileSync(filePath, "utf-8");
    const checksum = createHash("sha256").update(sql).digest("hex");

    applyMigration(db, fileName, sql, checksum);

    const record = db
      .prepare(
        `SELECT version, name, applied_at, checksum
         FROM schema_migrations
         WHERE version = ?`
      )
      .get(version) as MigrationRecord;

    newlyApplied.push(record);

    logger.info("migration_applied", {
      version: record.version,
      name: record.name
    });
  }

  if (newlyApplied.length > 0) {
    const metadataTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'database_metadata'")
      .get();

    if (metadataTable) {
      db.prepare(
        `UPDATE database_metadata
         SET schema_version = ?, last_migration = datetime('now')
         WHERE id = 1`
      ).run(newlyApplied.at(-1)?.version ?? "001");
    }
  }

  return newlyApplied;
}

export function getMigrationStatus(db: Database.Database): MigrationRecord[] {
  ensureMigrationsTable(db);

  return db
    .prepare(
      `SELECT version, name, applied_at, checksum
       FROM schema_migrations
       ORDER BY version ASC`
    )
    .all() as MigrationRecord[];
}
