import type { NormalizedPrice } from "@portfolio-tracker/shared/market-types";

export interface MarketProvider {
  name: string;
  getPrice(ticker: string, market: string): Promise<NormalizedPrice | null>;
}

export class MockMarketProvider implements MarketProvider {
  name = "mock";

  async getPrice(ticker: string, market: string): Promise<NormalizedPrice | null> {
    const seed = ticker.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return {
      ticker,
      market,
      price: 50 + (seed % 200),
      currency: market === "BIST" ? "TRY" : "USD",
      timestamp: new Date().toISOString(),
      provider: this.name
    };
  }
}

export class ProviderManager {
  constructor(private readonly providers: MarketProvider[]) {}

  async getPrice(ticker: string, market: string): Promise<NormalizedPrice | null> {
    for (const provider of this.providers) {
      const price = await provider.getPrice(ticker, market);
      if (price) return price;
    }
    return null;
  }
}
