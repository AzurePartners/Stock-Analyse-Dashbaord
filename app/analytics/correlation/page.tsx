'use client';

import Sidebar from '@/components/Sidebar';
import CorrelationHeatmap from '@/components/CorrelationHeatmap';

export default function CorrelationPage() {
  return (
    <div className="min-h-screen bg-purity-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          <div className="lg:col-span-9">
            <div className="mt-0">
              <CorrelationHeatmap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
