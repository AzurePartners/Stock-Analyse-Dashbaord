export interface StockData {
  ticker: string;
  dates: string[];
  closingPrices: number[];
  adjustedClose: number[];
}

export interface ComputedMetrics {
  dailyReturns: number[];
  volatility: number; // Annualized volatility
  sma5: number[];
  sma20: number[];
  cumulativeReturn: number; // Monthly cumulative return %
  sharpeRatio: number;
  rollingVol10: number[]; // 10-day rolling volatility (daily stddev)
  sharpeDaily: number; // mean(daily_returns) / std(daily_returns)
}

export interface PortfolioMetrics {
  weightedReturn: number;
  weightedVolatility: number;
}

