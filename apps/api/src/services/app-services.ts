import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type Database from "better-sqlite3";
import { NotFoundError, ValidationError } from "@portfolio-tracker/shared/errors";
import type { Asset } from "../database/models/types";
import type { Transaction } from "../database/models/types";
import { AssetRepository } from "../repositories/asset-repository";
import { TransactionRepository } from "../repositories/transaction-repository";
import { MockMarketProvider, ProviderManager } from "../providers/market-provider";
import { buildPortfolio, type PortfolioSummary } from "./portfolio-engine";

export interface ReportSummary {
  generatedAt: string;
  summary: PortfolioSummary;
  totalsByTicker: Array<{ ticker: string; marketValue: number; allocation: number }>;
}

export interface BackupResult {
  fileName: string;
  filePath: string;
  checksum: string;
  size: number;
}

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

  searchAssets(query: string) {
    return this.assets.search(query);
  }

  getAsset(id: number): Asset {
    const asset = this.assets.findById(id);
    if (!asset) throw new NotFoundError("Asset", id);
    return asset;
  }

  createAsset(input: Omit<Asset, "id" | "createdAt" | "updatedAt" | "deletedAt">): Asset {
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

  async getPortfolioReport(): Promise<ReportSummary> {
    const summary = await this.getPortfolioSummary();

    return {
      generatedAt: new Date().toISOString(),
      summary,
      totalsByTicker: summary.positions.map((position) => ({
        ticker: position.ticker,
        marketValue: position.marketValue,
        allocation: position.allocation
      }))
    };
  }

  exportTransactionsCsv(): string {
    const rows = this.transactions.findAllOrdered();
    const header = [
      "id",
      "assetId",
      "transactionType",
      "quantity",
      "unitPrice",
      "commission",
      "tax",
      "currency",
      "exchangeRate",
      "tradeDate",
      "settlementDate",
      "broker",
      "account",
      "notes"
    ].join(",");

    const body = rows.map((row) => [
      row.id,
      row.assetId,
      row.transactionType,
      row.quantity,
      row.unitPrice,
      row.commission,
      row.tax,
      row.currency,
      row.exchangeRate,
      row.tradeDate,
      row.settlementDate ?? "",
      row.broker ?? "",
      row.account ?? "",
      JSON.stringify(row.notes ?? "")
    ].join(","));

    return [header, ...body].join("\n");
  }

  importTransactionsCsv(csv: string): { imported: number; skipped: number } {
    const lines = csv.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      throw new ValidationError("CSV must contain a header and at least one row");
    }

    const [, ...rows] = lines;
    let imported = 0;
    let skipped = 0;

    for (const line of rows) {
      const [
        ,
        assetId,
        transactionType,
        quantity,
        unitPrice,
        commission,
        tax,
        currency,
        exchangeRate,
        tradeDate,
        settlementDate,
        broker,
        account,
        notes
      ] = line.split(",");

      try {
        this.createTransaction({
          assetId: Number(assetId),
          transactionType,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
          commission: Number(commission),
          tax: Number(tax),
          currency,
          exchangeRate: Number(exchangeRate),
          tradeDate,
          settlementDate: settlementDate || null,
          broker: broker || null,
          account: account || null,
          notes: notes ? JSON.parse(notes) : null
        });
        imported += 1;
      } catch {
        skipped += 1;
      }
    }

    return { imported, skipped };
  }

  getSettings(): Record<string, string> {
    const rows = this.db.prepare(`SELECT key, value FROM settings`).all() as Array<{ key: string; value: string }>;
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

  createBackup(): BackupResult {
    const dataDir = path.resolve(path.dirname(String(this.db.name)));
    const backupsDir = path.join(dataDir, "backups");
    fs.mkdirSync(backupsDir, { recursive: true });

    const fileName = `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.db`;
    const filePath = path.join(backupsDir, fileName);
    const sourcePath = String(this.db.name);

    fs.copyFileSync(sourcePath, filePath);
    const buffer = fs.readFileSync(filePath);
    const checksum = crypto.createHash("sha256").update(buffer).digest("hex");
    const size = fs.statSync(filePath).size;

    this.db.prepare(
      `INSERT INTO backup_history (backup_name, backup_size, checksum, restore_verified, status)
       VALUES (?, ?, ?, 0, 'created')`
    ).run(fileName, size, checksum);

    return { fileName, filePath, checksum, size };
  }

  listBackups() {
    return this.db.prepare(`SELECT * FROM backup_history ORDER BY backup_date DESC`).all();
  }

  restoreBackup(fileName: string): { restored: boolean; fileName: string } {
    const sourcePath = String(this.db.name);
    const backupPath = path.join(path.dirname(sourcePath), "backups", fileName);

    if (!fs.existsSync(backupPath)) {
      throw new NotFoundError("Backup", fileName);
    }

    this.db.close();
    fs.copyFileSync(backupPath, sourcePath);
    return { restored: true, fileName };
  }
}
