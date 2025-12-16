'use client';
import TickerInput from '@/components/TickerInput';
import PriceTrendChart from '@/components/PriceTrendChart';
import PortfolioAllocation from '@/components/PortfolioAllocation';
import Sidebar from '@/components/Sidebar';
import SummaryTiles from '@/components/SummaryTiles';
import HeroCard from '@/components/HeroCard';
// Removed AnalyticsTabs in favor of dedicated pages

export default function Home() {

  return (
    <div className="min-h-screen bg-purity-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          {/* Content */}
          <div className="lg:col-span-9">
            {/* Header removed per request */}
            {/* Input + KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              <div className="lg:col-span-8 bg-purity-card border border-purity-border rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-2">Built by developers</div>
                <TickerInput />
              </div>
              <div className="lg:col-span-4">
                <HeroCard />
              </div>
            </div>
            <div className="mb-6">
              <SummaryTiles />
            </div>
            {/* Key Charts */}
            <div id="dashboard" className="grid grid-cols-1 gap-6 mb-6">
              <PriceTrendChart />
              <PortfolioAllocation />
            </div>
            {/* Advanced analytics moved to dedicated pages via sidebar links */}
            <div id="portfolio" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Powered by Alpha Vantage API • Data for informational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}

