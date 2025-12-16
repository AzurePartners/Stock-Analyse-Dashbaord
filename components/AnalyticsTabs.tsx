'use client';

import { useState } from 'react';
import DailyReturnsChart from './DailyReturnsChart';
import RollingVolatilityChart from './RollingVolatilityChart';
import SharpeComparisonChart from './SharpeComparisonChart';
import CorrelationHeatmap from './CorrelationHeatmap';
import RiskReturnScatter from './RiskReturnScatter';

const tabs = [
  { key: 'performance', label: 'Performance', components: [DailyReturnsChart] },
  { key: 'risk', label: 'Risk', components: [RollingVolatilityChart, RiskReturnScatter] },
  { key: 'correlation', label: 'Correlation', components: [CorrelationHeatmap] },
  { key: 'comparison', label: 'Comparison', components: [SharpeComparisonChart] },
];

export default function AnalyticsTabs() {
  const [active, setActive] = useState('performance');
  const TabContent = tabs.find(t => t.key === active)?.components || [];
  return (
    <div className="bg-purity-card border border-purity-border rounded-xl">
      <div className="flex items-center gap-2 p-4 border-b border-purity-border">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-2 rounded-lg text-sm ${
              active === t.key ? 'bg-purity-mint text-white' : 'bg-purity-bg text-purity-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {TabContent.map((C, i) => (
          <div key={i}><C /></div>
        ))}
      </div>
    </div>
  );
}
