import { ValidationError } from "@portfolio-tracker/shared/errors";
import type { Asset } from "../database/models/types";
import type { Transaction } from "../database/models/types";

export interface Position {
  assetId: number;
  ticker: string;
  displayName: string;
  quantity: number;
  averageCost: number;
  costBasis: number;
  marketPrice: number;
  marketValue: number;
  realizedProfit: number;
  unrealizedProfit: number;
  allocation: number;
}

export interface PortfolioSummary {
  portfolioValue: number;
  cashBalance: number;
  totalCost: number;
  totalProfit: number;
  totalReturnPct: number;
  positions: Position[];
}

interface AssetState {
  quantity: number;
  totalCost: number;
  averageCost: number;
  realizedProfit: number;
}

const CASH_TRANSACTION_TYPES = new Set(["DEPOSIT", "WITHDRAW", "FEE", "TAX", "DIVIDEND"]);

function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((left, right) => {
    const byTradeDate = left.tradeDate.localeCompare(right.tradeDate);
    if (byTradeDate !== 0) return byTradeDate;

    const byCreatedAt = left.createdAt.localeCompare(right.createdAt);
    if (byCreatedAt !== 0) return byCreatedAt;

    return left.id - right.id;
  });
}

function ensureNonNegativeQuantity(quantity: number, tx: Transaction): void {
  if (quantity < 0) {
    throw new ValidationError(`Transaction ${tx.id} would create a negative position`, [
      { assetId: tx.assetId, transactionType: tx.transactionType }
    ]);
  }
}

export function buildPortfolio(
  assets: Asset[],
  transactions: Transaction[],
  prices: Map<number, number>
): PortfolioSummary {
  const assetMap = new Map(assets.map((asset) => [asset.id, asset]));
  const states = new Map<number, AssetState>();
  let cashBalance = 0;

  for (const tx of sortTransactions(transactions)) {
    const type = tx.transactionType.toUpperCase();
    const state = states.get(tx.assetId) ?? {
      quantity: 0,
      totalCost: 0,
      averageCost: 0,
      realizedProfit: 0
    };

    if (type === "BUY") {
      const buyCost = tx.quantity * tx.unitPrice + tx.commission + tx.tax;
      state.totalCost += buyCost;
      state.quantity += tx.quantity;
      state.averageCost = state.quantity > 0 ? state.totalCost / state.quantity : 0;
      cashBalance -= buyCost;
    } else if (type === "SELL") {
      ensureNonNegativeQuantity(state.quantity - tx.quantity, tx);
      const sellValue = tx.quantity * tx.unitPrice - tx.commission - tx.tax;
      const costOfSold = state.averageCost * tx.quantity;
      state.realizedProfit += sellValue - costOfSold;
      state.quantity -= tx.quantity;
      state.totalCost = state.averageCost * state.quantity;
      if (state.quantity === 0) {
        state.totalCost = 0;
        state.averageCost = 0;
      }
      cashBalance += sellValue;
    } else if (type === "DIVIDEND") {
      cashBalance += tx.quantity * tx.unitPrice - tx.tax;
      state.realizedProfit += tx.quantity * tx.unitPrice - tx.tax;
    } else if (type === "SPLIT") {
      if (tx.quantity <= 0) {
        throw new ValidationError("Split quantity must be positive");
      }
      state.quantity *= tx.quantity;
      state.averageCost = state.quantity > 0 ? state.totalCost / state.quantity : 0;
    } else if (type === "BONUS_ISSUE") {
      state.quantity += tx.quantity;
      state.averageCost = state.quantity > 0 ? state.totalCost / state.quantity : 0;
    } else if (type === "TRANSFER_IN") {
      state.quantity += tx.quantity;
    } else if (type === "TRANSFER_OUT") {
      ensureNonNegativeQuantity(state.quantity - tx.quantity, tx);
      state.quantity -= tx.quantity;
      state.totalCost = state.averageCost * state.quantity;
    } else if (type === "DEPOSIT") {
      cashBalance += tx.quantity * tx.unitPrice;
    } else if (type === "WITHDRAW") {
      cashBalance -= tx.quantity * tx.unitPrice;
    } else if (type === "FEE") {
      cashBalance -= tx.quantity * tx.unitPrice || tx.commission;
    } else if (type === "TAX") {
      cashBalance -= tx.quantity * tx.unitPrice || tx.tax;
    } else if (!CASH_TRANSACTION_TYPES.has(type)) {
      throw new ValidationError(`Unsupported transaction type: ${type}`);
    }

    if (state.quantity < 0) {
      throw new ValidationError(`Negative position detected for asset ${tx.assetId}`);
    }

    states.set(tx.assetId, state);
  }

  const positions: Position[] = [];
  let investedValue = 0;

  for (const [assetId, state] of states) {
    if (state.quantity <= 0) continue;
    const asset = assetMap.get(assetId);
    if (!asset) continue;

    const marketPrice = prices.get(assetId) ?? state.averageCost;
    const marketValue = state.quantity * marketPrice;
    const unrealizedProfit = marketValue - state.totalCost;
    investedValue += marketValue;

    positions.push({
      assetId,
      ticker: asset.ticker,
      displayName: asset.displayName,
      quantity: state.quantity,
      averageCost: state.averageCost,
      costBasis: state.totalCost,
      marketPrice,
      marketValue,
      realizedProfit: state.realizedProfit,
      unrealizedProfit,
      allocation: 0
    });
  }

  const portfolioValue = investedValue + cashBalance;
  const totalCost = positions.reduce((sum, position) => sum + position.costBasis, 0);
  const totalProfit = positions.reduce(
    (sum, position) => sum + position.realizedProfit + position.unrealizedProfit,
    0
  );

  for (const position of positions) {
    position.allocation = portfolioValue > 0 ? (position.marketValue / portfolioValue) * 100 : 0;
  }

  return {
    portfolioValue,
    cashBalance,
    totalCost,
    totalProfit,
    totalReturnPct: totalCost > 0 ? (totalProfit / totalCost) * 100 : 0,
    positions
  };
}
