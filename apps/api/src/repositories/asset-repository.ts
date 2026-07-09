import type { Asset, AssetRow } from "../database/models/types";
import { mapAssetDomainToRow, mapAssetRowToDomain } from "../database/models/mappers";
import { BaseRepository, paginate, type PaginationParams } from "./base";

export class AssetRepository extends BaseRepository {
  findAll(params: PaginationParams): ReturnType<typeof paginate<Asset>> {
    const rows = this.db
      .prepare(
        `SELECT * FROM assets WHERE deleted_at IS NULL ORDER BY ticker ASC`
      )
      .all() as AssetRow[];

    const items = rows.map(mapAssetRowToDomain);
    return paginate(items, params);
  }

  findById(id: number): Asset | null {
    const row = this.db
      .prepare(`SELECT * FROM assets WHERE id = ? AND deleted_at IS NULL`)
      .get(id) as AssetRow | undefined;

    return row ? mapAssetRowToDomain(row) : null;
  }

  search(query: string): Asset[] {
    const rows = this.db
      .prepare(
        `SELECT * FROM assets
         WHERE deleted_at IS NULL
           AND (ticker LIKE ? OR display_name LIKE ?)
         ORDER BY ticker ASC
         LIMIT 50`
      )
      .all(`%${query}%`, `%${query}%`) as AssetRow[];

    return rows.map(mapAssetRowToDomain);
  }

  create(input: Omit<Asset, "id" | "createdAt" | "updatedAt" | "deletedAt">): Asset {
    const now = new Date().toISOString();
    const result = this.db
      .prepare(
        `INSERT INTO assets (
          ticker, display_name, market, asset_type, currency, provider, isin, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        input.ticker,
        input.displayName,
        input.market,
        input.assetType,
        input.currency,
        input.provider,
        input.isin,
        input.status,
        now,
        now
      );

    return this.findById(Number(result.lastInsertRowid))!;
  }

  update(id: number, input: Partial<Asset>): Asset {
    const existing = this.findById(id);
    if (!existing) {
      throw new Error("Asset not found");
    }

    const merged = { ...existing, ...input, updatedAt: new Date().toISOString() };
    const row = mapAssetDomainToRow(merged);

    this.db
      .prepare(
        `UPDATE assets SET
          ticker = ?, display_name = ?, market = ?, asset_type = ?, currency = ?,
          provider = ?, isin = ?, status = ?, updated_at = ?
         WHERE id = ?`
      )
      .run(
        row.ticker,
        row.display_name,
        row.market,
        row.asset_type,
        row.currency,
        row.provider,
        row.isin,
        row.status,
        row.updated_at,
        id
      );

    return this.findById(id)!;
  }

  softDelete(id: number): void {
    this.db
      .prepare(`UPDATE assets SET deleted_at = ?, updated_at = ? WHERE id = ?`)
      .run(new Date().toISOString(), new Date().toISOString(), id);
  }
}
