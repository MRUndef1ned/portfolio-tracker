import { ValidationError } from "@portfolio-tracker/shared/errors";
import { describe, expect, it } from "vitest";
import { buildPortfolio } from "./portfolio-engine";

const asset = {
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
};

describe("buildPortfolio", () => {
  it("calculates weighted average and sell profit", () => {
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

    const summary = buildPortfolio([asset], transactions, new Map([[1, 120]]));

    expect(summary.positions[0]?.quantity).toBe(60);
    expect(summary.positions[0]?.averageCost).toBe(100);
    expect(summary.positions[0]?.realizedProfit).toBe(2000);
  });

  it("keeps transaction order deterministic and accounts for dividends and taxes", () => {
    const transactions = [
      {
        id: 2,
        assetId: 1,
        transactionType: "BUY",
        quantity: 10,
        unitPrice: 100,
        commission: 5,
        tax: 0,
        currency: "TRY",
        exchangeRate: 1,
        tradeDate: "2026-01-02",
        settlementDate: null,
        broker: null,
        account: null,
        notes: null,
        createdAt: "2026-01-02T12:00:00.000Z",
        updatedAt: "2026-01-02T12:00:00.000Z",
        deletedAt: null
      },
      {
        id: 1,
        assetId: 1,
        transactionType: "DEPOSIT",
        quantity: 1,
        unitPrice: 2000,
        commission: 0,
        tax: 0,
        currency: "TRY",
        exchangeRate: 1,
        tradeDate: "2026-01-01",
        settlementDate: null,
        broker: null,
        account: null,
        notes: null,
        createdAt: "2026-01-01T12:00:00.000Z",
        updatedAt: "2026-01-01T12:00:00.000Z",
        deletedAt: null
      },
      {
        id: 3,
        assetId: 1,
        transactionType: "DIVIDEND",
        quantity: 10,
        unitPrice: 2,
        commission: 0,
        tax: 3,
        currency: "TRY",
        exchangeRate: 1,
        tradeDate: "2026-01-03",
        settlementDate: null,
        broker: null,
        account: null,
        notes: null,
        createdAt: "2026-01-03T12:00:00.000Z",
        updatedAt: "2026-01-03T12:00:00.000Z",
        deletedAt: null
      }
    ];

    const summary = buildPortfolio([asset], transactions, new Map([[1, 110]]));

    expect(summary.cashBalance).toBe(1012);
    expect(summary.positions[0]?.averageCost).toBe(100.5);
    expect(summary.totalProfit).toBeCloseTo(112);
  });

  it("rejects negative positions", () => {
    expect(() =>
      buildPortfolio(
        [asset],
        [
          {
            id: 1,
            assetId: 1,
            transactionType: "SELL",
            quantity: 1,
            unitPrice: 10,
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
          }
        ],
        new Map()
      )
    ).toThrow(ValidationError);
  });
});
