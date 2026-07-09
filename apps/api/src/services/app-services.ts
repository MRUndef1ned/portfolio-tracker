import type Database from "better-sqlite3";
import { NotFoundError } from "@portfolio-tracker/shared/errors";
import type { Asset } from "../database/models/types";
import type { Transaction } from "../database/models/types";
import { AssetRepository } from "../repositories/asset-repository";
import { TransactionRepository } from "../repositories/transaction-repository";
import { MockMarketProvider, ProviderManager } from "../providers/market-provider";
import { buildPortfolio, type PortfolioSummary } from "./portfolio-engine";

export class AppServices {
  readonly assets: AssetRepository;
  readonly transactions: TransactionRepository;
  readonly providers: ProviderManager;

  constructor(private readonly db: Database.Database) {
    this.assets = new AssetRepository(db);
    this.transactions = new TransactionRepository(db);
    this.providers = new ProviderManager([new MockMarketProvider()]);
  }

  listAssets(page: number, pageSize: number) {
    return this.assets.findAll({ page, pageSize });
  }

  getAsset(id: number): Asset {
    const asset = this.assets.findById(id);
    if (!asset) throw new NotFoundError("Asset", id);
    return asset;
  }

  createAsset(
    input: Omit<Asset, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ): Asset {
    return this.assets.create(input);
  }

  updateAsset(id: number, input: Partial<Asset>): Asset {
    this.getAsset(id);
    return this.assets.update(id, input);
  }

  deleteAsset(id: number): void {
    this.getAsset(id);
    this.assets.softDelete(id);
  }

  listTransactions(page: number, pageSize: number) {
    return this.transactions.findAll({ page, pageSize });
  }

  getTransaction(id: number): Transaction {
    const tx = this.transactions.findById(id);
    if (!tx) throw new NotFoundError("Transaction", id);
    return tx;
  }

  createTransaction(
    input: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ): Transaction {
    this.getAsset(input.assetId);
    return this.transactions.create(input);
  }

  updateTransaction(id: number, input: Partial<Transaction>): Transaction {
    this.getTransaction(id);
    return this.transactions.update(id, input);
  }

  deleteTransaction(id: number): void {
    this.getTransaction(id);
    this.transactions.softDelete(id);
  }

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const assets = this.assets.findAll({ page: 1, pageSize: 10000 }).items;
    const transactions = this.transactions.findAllOrdered();
    const prices = new Map<number, number>();

    for (const asset of assets) {
      const quote = await this.providers.getPrice(asset.ticker, asset.market);
      if (quote) prices.set(asset.id, quote.price);
    }

    return buildPortfolio(assets, transactions, prices);
  }

  getSettings(): Record<string, string> {
    const rows = this.db
      .prepare(`SELECT key, value FROM settings`)
      .all() as Array<{ key: string; value: string }>;

    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  }

  updateSettings(values: Record<string, string>): Record<string, string> {
    const stmt = this.db.prepare(
      `INSERT INTO settings (key, value, type, updated_at)
       VALUES (?, ?, 'string', datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
    );

    for (const [key, value] of Object.entries(values)) {
      stmt.run(key, value);
    }

    return this.getSettings();
  }
}
