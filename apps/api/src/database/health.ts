import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type Database from "better-sqlite3";

export interface DatabaseHealth {
  ok: boolean;
  result: number;
  diskFreeMb: number;
  integrity: string;
}

export function checkDatabaseHealth(db: Database.Database): DatabaseHealth {
  const row = db.prepare("SELECT 1 AS result").get() as { result: number };
  const integrityRow = db.prepare("PRAGMA integrity_check").get() as { integrity_check?: string };
  const freeDir = path.dirname(String(db.name));
  const stats = fs.statfsSync(freeDir || os.tmpdir());

  return {
    ok: row.result === 1 && (integrityRow.integrity_check ?? "ok") === "ok",
    result: row.result,
    diskFreeMb: Math.round((stats.bavail * stats.bsize) / 1024 / 1024),
    integrity: integrityRow.integrity_check ?? "unknown"
  };
}
