import type { Transaction, TransactionRow } from "../database/models/types";
import {
  mapTransactionDomainToRow,
  mapTransactionRowToDomain
} from "../database/models/mappers";
import { BaseRepository, paginate, type PaginationParams } from "./base";

export class TransactionRepository extends BaseRepository {
  findAll(params: PaginationParams): ReturnType<typeof paginate<Transaction>> {
    const rows = this.db
      .prepare(
        `SELECT * FROM transactions
         WHERE deleted_at IS NULL
         ORDER BY trade_date ASC, created_at ASC, id ASC`
      )
      .all() as TransactionRow[];

    return paginate(rows.map(mapTransactionRowToDomain), params);
  }

  findById(id: number): Transaction | null {
    const row = this.db
      .prepare(`SELECT * FROM transactions WHERE id = ? AND deleted_at IS NULL`)
      .get(id) as TransactionRow | undefined;

    return row ? mapTransactionRowToDomain(row) : null;
  }

  findAllOrdered(): Transaction[] {
    const rows = this.db
      .prepare(
        `SELECT * FROM transactions
         WHERE deleted_at IS NULL
         ORDER BY trade_date ASC, created_at ASC, id ASC`
      )
      .all() as TransactionRow[];

    return rows.map(mapTransactionRowToDomain);
  }

  create(
    input: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ): Transaction {
    const now = new Date().toISOString();
    const result = this.db
      .prepare(
        `INSERT INTO transactions (
          asset_id, transaction_type, quantity, unit_price, commission, tax, currency,
          exchange_rate, trade_date, settlement_date, broker, account, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        input.assetId,
        input.transactionType,
        input.quantity,
        input.unitPrice,
        input.commission,
        input.tax,
        input.currency,
        input.exchangeRate,
        input.tradeDate,
        input.settlementDate,
        input.broker,
        input.account,
        input.notes,
        now,
        now
      );

    return this.findById(Number(result.lastInsertRowid))!;
  }

  update(id: number, input: Partial<Transaction>): Transaction {
    const existing = this.findById(id);
    if (!existing) {
      throw new Error("Transaction not found");
    }

    const merged = { ...existing, ...input, updatedAt: new Date().toISOString() };
    const row = mapTransactionDomainToRow(merged);

    this.db
      .prepare(
        `UPDATE transactions SET
          asset_id = ?, transaction_type = ?, quantity = ?, unit_price = ?, commission = ?,
          tax = ?, currency = ?, exchange_rate = ?, trade_date = ?, settlement_date = ?,
          broker = ?, account = ?, notes = ?, updated_at = ?
         WHERE id = ?`
      )
      .run(
        row.asset_id,
        row.transaction_type,
        row.quantity,
        row.unit_price,
        row.commission,
        row.tax,
        row.currency,
        row.exchange_rate,
        row.trade_date,
        row.settlement_date,
        row.broker,
        row.account,
        row.notes,
        row.updated_at,
        id
      );

    return this.findById(id)!;
  }

  softDelete(id: number): void {
    this.db
      .prepare(`UPDATE transactions SET deleted_at = ?, updated_at = ? WHERE id = ?`)
      .run(new Date().toISOString(), new Date().toISOString(), id);
  }
}
