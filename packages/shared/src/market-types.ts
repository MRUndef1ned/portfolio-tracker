export interface NormalizedPrice {
  ticker: string;
  market: string;
  price: number;
  currency: string;
  timestamp: string;
  provider: string;
}

export interface NormalizedExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  timestamp: string;
  provider: string;
}
