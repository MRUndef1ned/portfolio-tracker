import { describe, expect, it } from "vitest";
import { buildPortfolio } from "./portfolio-engine";

describe("buildPortfolio", () => {
  it("calculates weighted average and sell profit", () => {
    const assets = [
      {
        id: 1,
        ticker: "THYAO",
        displayName: "Turkish Airlines",
        market: "BIST",
        assetType: "STOCK",
        currency: "TRY",
        provider: null,
        isin: null,
        status: "active",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        deletedAt: null
      }
    ];

    const transactions = [
      {
        id: 1,
        assetId: 1,
        transactionType: "DEPOSIT",
        quantity: 1,
        unitPrice: 10000,
        commission: 0,
        tax: 0,
        currency: "TRY",
        exchangeRate: 1,
        tradeDate: "2026-01-01",
        settlementDate: null,
        broker: null,
        account: null,
        notes: null,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        deletedAt: null
      },
      {
        id: 2,
        assetId: 1,
        transactionType: "BUY",
        quantity: 100,
        unitPrice: 100,
        commission: 0,
        tax: 0,
        currency: "TRY",
        exchangeRate: 1,
        tradeDate: "2026-01-02",
        settlementDate: null,
        broker: null,
        account: null,
        notes: null,
        createdAt: "2026-01-02",
        updatedAt: "2026-01-02",
        deletedAt: null
      },
      {
        id: 3,
        assetId: 1,
        transactionType: "SELL",
        quantity: 40,
        unitPrice: 150,
        commission: 0,
        tax: 0,
        currency: "TRY",
        exchangeRate: 1,
        tradeDate: "2026-01-03",
        settlementDate: null,
        broker: null,
        account: null,
        notes: null,
        createdAt: "2026-01-03",
        updatedAt: "2026-01-03",
        deletedAt: null
      }
    ];

    const summary = buildPortfolio(assets, transactions, new Map([[1, 120]]));

    expect(summary.positions[0]?.quantity).toBe(60);
    expect(summary.positions[0]?.averageCost).toBe(100);
    expect(summary.positions[0]?.realizedProfit).toBe(2000);
  });
});
