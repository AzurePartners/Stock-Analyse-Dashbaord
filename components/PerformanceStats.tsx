'use client';

import usePortfolioStore from '@/store/portfolioStore';
import { mean, std } from '@/lib/calculations';

export default function PerformanceStats() {
  const { tickers, computedMetrics } = usePortfolioStore();
  const allReturns = tickers.flatMap(t => computedMetrics[t]?.dailyReturns || []);
  const avgReturn = allReturns.length ? mean(allReturns) : 0;
  const avgStd = allReturns.length ? std(allReturns) : 0;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="card p-4">
        <div className="text-sm text-gray-500">Avg Daily Return</div>
        <div className="text-xl font-semibold text-purity-text mt-1">{avgReturn.toFixed(2)}%</div>
      </div>
      <div className="card p-4">
        <div className="text-sm text-gray-500">Avg Daily Volatility</div>
        <div className="text-xl font-semibold text-purity-text mt-1">{avgStd.toFixed(2)}</div>
      </div>
      <div className="card p-4">
        <div className="text-sm text-gray-500">Tickers</div>
        <div className="text-xl font-semibold text-purity-text mt-1">{tickers.length}</div>
      </div>
    </div>
  );
}
