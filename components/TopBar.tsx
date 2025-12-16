'use client';

export default function TopBar() {
  return (
    <div className="bg-purity-card border border-purity-border rounded-xl px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-purity-mint grid place-items-center text-white">□</div>
        <span className="text-sm font-semibold text-purity-text">Dashboard</span>
      </div>
    </div>
  );
}
