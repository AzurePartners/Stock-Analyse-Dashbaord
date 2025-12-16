'use client';

import { useMemo } from 'react';
import usePortfolioStore from '@/store/portfolioStore';
import { computeCorrelationMatrix } from '@/lib/calculations';

export default function InsightsPanel() {
  const { tickers, computedMetrics, portfolioMetrics, stockData } = usePortfolioStore();

  const insights = useMemo(() => {
    if (tickers.length === 0 || Object.keys(computedMetrics).length === 0) {
      return [];
    }

    const insightsList: string[] = [];

    // Find highest return
    const returns = tickers
      .map(ticker => ({
        ticker,
        return: computedMetrics[ticker]?.cumulativeReturn || 0,
      }))
      .filter(r => r.return !== 0);

    if (returns.length > 0) {
      const highestReturn = returns.reduce((max, curr) => 
        curr.return > max.return ? curr : max
      );
      const lowestReturn = returns.reduce((min, curr) => 
        curr.return < min.return ? curr : min
      );

      insightsList.push(
        `${highestReturn.ticker} had the highest monthly return at ${highestReturn.return.toFixed(2)}%.`
      );

      if (lowestReturn.return < 0) {
        insightsList.push(
          `${lowestReturn.ticker} had the lowest return at ${lowestReturn.return.toFixed(2)}%.`
        );
      }
    }

    // Find highest volatility
    const volatilities = tickers
      .map(ticker => ({
        ticker,
        volatility: computedMetrics[ticker]?.volatility || 0,
      }))
      .filter(v => v.volatility > 0);

    if (volatilities.length > 0) {
      const highestVol = volatilities.reduce((max, curr) => 
        curr.volatility > max.volatility ? curr : max
      );
      const lowestVol = volatilities.reduce((min, curr) =>
        curr.volatility < min.volatility ? curr : min
      );
      insightsList.push(
        `${highestVol.ticker} shows the highest volatility at ${highestVol.volatility.toFixed(2)}%.`
      );
      insightsList.push(
        `Most stable asset: ${lowestVol.ticker} (lowest volatility: ${lowestVol.volatility.toFixed(2)}%).`
      );
    }

    // Portfolio summary
    if (portfolioMetrics) {
      insightsList.push(
        `Portfolio expected return: ${portfolioMetrics.weightedReturn.toFixed(2)}%, volatility: ${portfolioMetrics.weightedVolatility.toFixed(2)}%.`
      );

      // Risk warning
      if (portfolioMetrics.weightedVolatility > 30) {
        insightsList.push(
          '⚠️ Warning: Portfolio volatility exceeds 30%, indicating high risk.'
        );
      } else if (portfolioMetrics.weightedVolatility > 20) {
        insightsList.push(
          '⚠️ Portfolio volatility is moderate to high. Consider diversification.'
        );
      }
    }

    // Sharpe ratio insights (daily definition)
    const sharpeRatiosDaily = tickers
      .map(ticker => ({
        ticker,
        sharpe: computedMetrics[ticker]?.sharpeDaily || 0,
      }))
      .filter(s => s.sharpe !== 0);

    if (sharpeRatiosDaily.length > 0) {
      const bestSharpe = sharpeRatiosDaily.reduce((max, curr) => 
        curr.sharpe > max.sharpe ? curr : max
      );
      insightsList.push(`Highest Sharpe ratio: ${bestSharpe.ticker} (${bestSharpe.sharpe.toFixed(2)})`);
      insightsList.push(`Highest risk-adjusted return: ${bestSharpe.ticker}`);
    }

    // Most correlated pair using daily returns
    const allTickers = stockData['SPY'] ? ['SPY', ...tickers] : [...tickers];
    const { pairs } = computeCorrelationMatrix(allTickers, stockData, computedMetrics);
    if (pairs.length > 0) {
      const top = pairs[0];
      insightsList.push(`Most correlated pair: ${top.a} and ${top.b} at ${top.corr.toFixed(2)} correlation`);
    }

    return insightsList;
  }, [tickers, computedMetrics, portfolioMetrics, stockData]);

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-purity-text">Insights</h2>
      {insights.length === 0 ? (
        <div className="text-gray-500">
          Enter tickers and analyze to see insights.
        </div>
      ) : (
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700"
            >
              <span className="text-purity-mint mt-1">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

