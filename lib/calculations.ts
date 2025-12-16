import { StockData, ComputedMetrics, PortfolioMetrics } from './types';

/**
 * Calculate daily returns as percentage
 */
export function calculateDailyReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const dailyReturn = ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100;
    returns.push(dailyReturn);
  }
  return returns;
}

/**
 * Calculate volatility (annualized standard deviation of daily returns)
 */
export function calculateVolatility(dailyReturns: number[]): number {
  if (dailyReturns.length === 0) return 0;

  const mean = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance);
  
  // Annualize: multiply by sqrt(252 trading days)
  return stdDev * Math.sqrt(252);
}

/**
 * Mean of numeric array
 */
export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

/**
 * Standard deviation of numeric array
 */
export function std(arr: number[]): number {
  if (arr.length === 0) return 0;
  const m = mean(arr);
  const variance = arr.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

/**
 * 10-day rolling volatility (stddev of daily returns over window)
 * Not annualized; intended for rolling chart display
 */
export function calculateRollingVolatility(dailyReturns: number[], window = 10): number[] {
  if (dailyReturns.length === 0) return [];
  const out: number[] = [];
  for (let i = 0; i < dailyReturns.length; i++) {
    if (i < window - 1) {
      out.push(NaN);
      continue;
    }
    const slice = dailyReturns.slice(i - window + 1, i + 1);
    out.push(std(slice));
  }
  return out;
}

/**
 * Sharpe using daily definition: mean(daily_returns) / std(daily_returns)
 * No risk-free adjustment; daily-level ratio for comparison bars
 */
export function calculateSharpeDaily(dailyReturns: number[]): number {
  const s = std(dailyReturns);
  if (s === 0) return 0;
  return mean(dailyReturns) / s;
}

/**
 * Calculate Simple Moving Average
 */
export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  
  return sma;
}

/**
 * Calculate monthly cumulative return
 */
export function calculateCumulativeReturn(prices: number[]): number {
  if (prices.length < 2) return 0;
  const initialPrice = prices[0];
  const finalPrice = prices[prices.length - 1];
  return ((finalPrice - initialPrice) / initialPrice) * 100;
}

/**
 * Calculate Sharpe ratio (assuming risk-free rate = 0)
 */
export function calculateSharpeRatio(returnPercent: number, volatility: number): number {
  if (volatility === 0) return 0;
  // Annualize return: monthly return * 12
  const annualizedReturn = (returnPercent / 100) * 12;
  return annualizedReturn / volatility;
}

/**
 * Compute all metrics for a stock
 */
export function computeStockMetrics(stockData: StockData): ComputedMetrics {
  const dailyReturns = calculateDailyReturns(stockData.closingPrices);
  const volatility = calculateVolatility(dailyReturns);
  const rollingVol10 = calculateRollingVolatility(dailyReturns, 10);
  const sma5 = calculateSMA(stockData.closingPrices, 5);
  const sma20 = calculateSMA(stockData.closingPrices, 20);
  const cumulativeReturn = calculateCumulativeReturn(stockData.closingPrices);
  const sharpeRatio = calculateSharpeRatio(cumulativeReturn, volatility);
  const sharpeDaily = calculateSharpeDaily(dailyReturns);

  return {
    dailyReturns,
    volatility,
    rollingVol10,
    sma5,
    sma20,
    cumulativeReturn,
    sharpeRatio,
    sharpeDaily,
  };
}

/**
 * Calculate portfolio-weighted metrics
 */
export function calculatePortfolioMetrics(
  tickers: string[],
  metrics: Record<string, ComputedMetrics>,
  weights: Record<string, number>
): PortfolioMetrics {
  if (tickers.length === 0) {
    return { weightedReturn: 0, weightedVolatility: 0 };
  }

  // Normalize weights
  const totalWeight = tickers.reduce((sum, ticker) => sum + (weights[ticker] || 0), 0);
  const normalizedWeights = tickers.reduce((acc, ticker) => {
    acc[ticker] = totalWeight > 0 ? (weights[ticker] || 0) / totalWeight : 1 / tickers.length;
    return acc;
  }, {} as Record<string, number>);

  // Calculate weighted return (annualized)
  const weightedReturn = tickers.reduce((sum, ticker) => {
    const metric = metrics[ticker];
    if (!metric) return sum;
    const annualizedReturn = (metric.cumulativeReturn / 100) * 12;
    return sum + annualizedReturn * normalizedWeights[ticker];
  }, 0);

  // Calculate weighted volatility (simplified - assumes correlation = 0)
  const weightedVolatility = Math.sqrt(
    tickers.reduce((sum, ticker) => {
      const metric = metrics[ticker];
      if (!metric) return sum;
      return sum + Math.pow(metric.volatility * normalizedWeights[ticker], 2);
    }, 0)
  );

  return {
    weightedReturn: weightedReturn * 100, // Convert back to percentage
    weightedVolatility,
  };
}

/**
 * Align multiple time series by common dates
 * Input: array of { label, dates, values }, returns aligned dates and values per label
 */
export function alignSeriesByDates(
  series: Array<{ label: string; dates: string[]; values: number[] }>
): { dates: string[]; valuesByLabel: Record<string, number[]> } {
  if (series.length === 0) return { dates: [], valuesByLabel: {} };
  const sets = series.map(s => new Set(s.dates));
  const commonDates = [...series[0].dates].filter(d => sets.every(set => set.has(d)));
  // Ensure chronological order
  commonDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const valuesByLabel: Record<string, number[]> = {};
  series.forEach(s => {
    const map: Record<string, number> = {};
    for (let i = 0; i < s.dates.length; i++) {
      map[s.dates[i]] = s.values[i];
    }
    valuesByLabel[s.label] = commonDates.map(d => map[d]);
  });

  return { dates: commonDates, valuesByLabel };
}

/**
 * Compute Pearson correlation matrix across tickers' daily returns
 * Uses aligned daily returns keyed by date for accuracy
 */
export function computeCorrelationMatrix(
  tickers: string[],
  stockData: Record<string, StockData>,
  metrics: Record<string, ComputedMetrics>
): { labels: string[]; matrix: number[][]; pairs: Array<{ a: string; b: string; corr: number }> } {
  const returnsByTicker = tickers
    .filter(t => stockData[t] && metrics[t] && metrics[t].dailyReturns?.length > 0)
    .map(t => {
      const dates = stockData[t].dates.slice(1); // returns align to dates from index 1
      const values = metrics[t].dailyReturns;
      return { label: t, dates, values };
    });

  if (returnsByTicker.length === 0) {
    return { labels: [], matrix: [], pairs: [] };
  }

  const { valuesByLabel } = alignSeriesByDates(returnsByTicker);
  const labels = returnsByTicker.map(s => s.label);

  function corr(x: number[], y: number[]): number {
    if (x.length === 0 || y.length === 0 || x.length !== y.length) return 0;
    const mx = mean(x);
    const my = mean(y);
    let num = 0;
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < x.length; i++) {
      const dx = x[i] - mx;
      const dy = y[i] - my;
      num += dx * dy;
      sx += dx * dx;
      sy += dy * dy;
    }
    const denom = Math.sqrt(sx * sy);
    return denom === 0 ? 0 : num / denom;
  }

  const matrix: number[][] = labels.map(a => {
    const xa = valuesByLabel[a] || [];
    return labels.map(b => {
      const xb = valuesByLabel[b] || [];
      return corr(xa, xb);
    });
  });

  const pairs: Array<{ a: string; b: string; corr: number }> = [];
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      pairs.push({ a: labels[i], b: labels[j], corr: matrix[i][j] });
    }
  }

  // Sort pairs by absolute correlation descending
  pairs.sort((p1, p2) => Math.abs(p2.corr) - Math.abs(p1.corr));

  return { labels, matrix, pairs };
}

