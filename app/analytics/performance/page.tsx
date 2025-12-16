'use client';

import Sidebar from '@/components/Sidebar';
import DailyReturnsChart from '@/components/DailyReturnsChart';
import PerformanceStats from '@/components/PerformanceStats';

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-purity-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 gap-6">
              <DailyReturnsChart />
              <PerformanceStats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
