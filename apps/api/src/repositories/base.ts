import type Database from "better-sqlite3";

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  { page, pageSize }: PaginationParams
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages
  };
}

export function softDeleteClause(alias = ""): string {
  const prefix = alias ? `${alias}.` : "";
  return `${prefix}deleted_at IS NULL`;
}

export class BaseRepository {
  constructor(protected readonly db: Database.Database) {}
}
