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

export function buildPortfolio(
  assets: Asset[],
  transactions: Transaction[],
  prices: Map<number, number>
): PortfolioSummary {
  const assetMap = new Map(assets.map((a) => [a.id, a]));
  const states = new Map<number, AssetState>();
  let cashBalance = 0;

  for (const tx of transactions) {
    const type = tx.transactionType.toUpperCase();
    const state = states.get(tx.assetId) ?? {
      quantity: 0,
      totalCost: 0,
      averageCost: 0,
      realizedProfit: 0
    };

    if (type === "BUY") {
      const buyCost = tx.quantity * tx.unitPrice + tx.commission;
      state.totalCost += buyCost;
      state.quantity += tx.quantity;
      state.averageCost = state.quantity > 0 ? state.totalCost / state.quantity : 0;
      cashBalance -= buyCost;
    } else if (type === "SELL") {
      const sellValue = tx.quantity * tx.unitPrice - tx.commission;
      const costOfSold = state.averageCost * tx.quantity;
      state.realizedProfit += sellValue - costOfSold;
      state.quantity -= tx.quantity;
      state.totalCost = state.averageCost * state.quantity;
      if (state.quantity <= 0) {
        state.quantity = 0;
        state.totalCost = 0;
        state.averageCost = 0;
      }
      cashBalance += sellValue;
    } else if (type === "DIVIDEND") {
      cashBalance += tx.quantity * tx.unitPrice - tx.tax;
    } else if (type === "DEPOSIT") {
      cashBalance += tx.quantity * tx.unitPrice;
    } else if (type === "WITHDRAW") {
      cashBalance -= tx.quantity * tx.unitPrice;
    } else if (type === "FEE") {
      cashBalance -= tx.commission;
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
  const totalCost = positions.reduce((sum, p) => sum + p.costBasis, 0);
  const totalProfit = positions.reduce((sum, p) => sum + p.realizedProfit + p.unrealizedProfit, 0);

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
