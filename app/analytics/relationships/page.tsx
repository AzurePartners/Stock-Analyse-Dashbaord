'use client';

import Sidebar from '@/components/Sidebar';
import CorrelationHeatmap from '@/components/CorrelationHeatmap';
import SharpeComparisonChart from '@/components/SharpeComparisonChart';
import usePortfolioStore from '@/store/portfolioStore';
import { computeCorrelationMatrix } from '@/lib/calculations';

function RelationshipStats() {
  const { tickers, stockData, computedMetrics } = usePortfolioStore();
  const allTickers = stockData['SPY'] ? ['SPY', ...tickers] : tickers;
  const { pairs } = computeCorrelationMatrix(allTickers, stockData, computedMetrics);
  const top = pairs[0];
  const bestSharpeTicker = tickers
    .map(t => ({ t, s: computedMetrics[t]?.sharpeDaily ?? 0 }))
    .sort((a, b) => b.s - a.s)[0];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-purity-card border border-purity-border rounded-xl p-4">
        <div className="text-sm text-gray-500">Most Correlated Pair</div>
        <div className="text-xl font-semibold text-purity-text mt-1">
          {top ? `${top.a} ↔ ${top.b}` : '—'}
        </div>
        <div className="text-xs text-gray-500 mt-1">{top ? top.corr.toFixed(2) : '—'}</div>
      </div>
      <div className="bg-purity-card border border-purity-border rounded-xl p-4">
        <div className="text-sm text-gray-500">Highest Sharpe (Daily)</div>
        <div className="text-xl font-semibold text-purity-text mt-1">
          {bestSharpeTicker ? bestSharpeTicker.t : '—'}
        </div>
        <div className="text-xs text-gray-500 mt-1">{bestSharpeTicker ? bestSharpeTicker.s.toFixed(2) : '—'}</div>
      </div>
    </div>
  );
}

export default function RelationshipsPage() {
  return (
    <div className="min-h-screen bg-purity-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CorrelationHeatmap />
              </div>
              <div>
                <SharpeComparisonChart />
              </div>
              <div className="lg:col-span-3">
                <RelationshipStats />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
