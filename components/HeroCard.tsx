'use client';

export default function HeroCard() {
  return (
    <div className="card h-full grid place-items-center">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-purity-mint grid place-items-center text-white font-bold">◎</div>
        <div className="text-purity-text">
          <div className="text-xl font-bold">Finance Dashboard</div>
          <div className="text-sm text-gray-600">Analyze portfolios and insights</div>
        </div>
      </div>
    </div>
  );
}
