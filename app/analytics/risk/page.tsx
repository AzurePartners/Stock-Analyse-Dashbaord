'use client';

import Sidebar from '@/components/Sidebar';
import RollingVolatilityChart from '@/components/RollingVolatilityChart';
import RiskReturnScatter from '@/components/RiskReturnScatter';

export default function RiskPage() {
  return (
    <div className="min-h-screen bg-purity-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          <div className="lg:col-span-9">
            <div className="mt-0 grid grid-cols-1 gap-6">
              <RollingVolatilityChart />
              <RiskReturnScatter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
