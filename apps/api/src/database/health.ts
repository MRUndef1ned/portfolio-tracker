import type Database from "better-sqlite3";

export interface DatabaseHealth {
  ok: boolean;
  result: number;
}

export function checkDatabaseHealth(db: Database.Database): DatabaseHealth {
  const row = db.prepare("SELECT 1 AS result").get() as { result: number };

  return {
    ok: row.result === 1,
    result: row.result
  };
}
