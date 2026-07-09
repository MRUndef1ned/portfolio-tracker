import { performance } from "node:perf_hooks";
import { buildPortfolio } from "../services/portfolio-engine";

const ASSET_COUNT = 50;
const TRANSACTIONS_PER_ASSET = 2000;

const assets = Array.from({ length: ASSET_COUNT }, (_, index) => ({
  id: index + 1,
  ticker: `A${index + 1}`,
  displayName: `Asset ${index + 1}`,
  market: "BIST",
  assetType: "STOCK",
  currency: "TRY",
  provider: null,
  isin: null,
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  deletedAt: null
}));

const transactions = [];

for (const asset of assets) {
  transactions.push({
    id: transactions.length + 1,
    assetId: asset.id,
    transactionType: "DEPOSIT",
    quantity: 1,
    unitPrice: 200_000,
    commission: 0,
    tax: 0,
    currency: "TRY",
    exchangeRate: 1,
    tradeDate: "2026-01-01",
    settlementDate: null,
    broker: null,
    account: "main",
    notes: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null
  });

  for (let i = 0; i < TRANSACTIONS_PER_ASSET; i += 1) {
    const date = `2026-02-${String((i % 28) + 1).padStart(2, "0")}`;
    const transactionType = i > 0 && i % 3 === 0 ? "SELL" : "BUY";
    transactions.push({
      id: transactions.length + 1,
      assetId: asset.id,
      transactionType,
      quantity: 1 + (i % 5),
      unitPrice: 80 + (i % 70),
      commission: 0.5,
      tax: 0,
      currency: "TRY",
      exchangeRate: 1,
      tradeDate: date,
      settlementDate: null,
      broker: "mock",
      account: "main",
      notes: null,
      createdAt: `2026-02-01T00:00:${String(i % 59).padStart(2, "0")}.000Z`,
      updatedAt: `2026-02-01T00:00:${String(i % 59).padStart(2, "0")}.000Z`,
      deletedAt: null
    });
  }
}

const prices = new Map<number, number>(assets.map((asset) => [asset.id, 120]));

const start = performance.now();
const summary = buildPortfolio(assets, transactions, prices);
const elapsed = performance.now() - start;

console.log(
  JSON.stringify(
    {
      elapsedMs: Number(elapsed.toFixed(2)),
      transactions: transactions.length,
      positions: summary.positions.length,
      portfolioValue: Number(summary.portfolioValue.toFixed(2))
    },
    null,
    2
  )
);
