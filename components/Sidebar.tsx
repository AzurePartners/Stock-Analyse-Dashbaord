'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-64 min-h-screen sticky top-0 p-4 card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purity-mint grid place-items-center text-white font-bold">Σ</div>
        <div>
          <div className="text-lg font-semibold text-purity-text">Home</div>
        </div>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li><Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purity-bg hover:bg-purity-sky text-purity-text" href="/">Home</Link></li>
          <li>
            <button onClick={() => setOpen(!open)} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg bg-purity-bg hover:bg-purity-sky text-purity-text">
              Analytics {open ? '▾' : '▸'}
            </button>
            {open && (
              <ul className="mt-1 pl-3 space-y-1">
                <li><Link className="block px-3 py-2 rounded-lg hover:bg-purity-sky text-gray-700" href="/analytics/performance">Performance</Link></li>
                <li><Link className="block px-3 py-2 rounded-lg hover:bg-purity-sky text-gray-700" href="/analytics/risk">Risk Analysis</Link></li>
                <li><Link className="block px-3 py-2 rounded-lg hover:bg-purity-sky text-gray-700" href="/analytics/relationships">Relationships</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <div className="p-3 rounded-xl bg-purity-sky text-purity-text">
        <div className="text-sm font-semibold mb-1">Need help?</div>
        <div className="text-xs text-gray-600 mb-2">Please check our docs.</div>
        <button className="w-full px-3 py-2 bg-purity-mint text-white rounded-lg text-sm">Documentation</button>
      </div>
    </aside>
  );
}
