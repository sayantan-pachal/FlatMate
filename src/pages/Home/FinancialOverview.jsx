import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { formatINR } from '../../lib/currency';

export default function FinancialOverview({
  owedToYouPaise = 27500,
  youOwePaise = 6268,
  onAnalyticsClick,
}) {
  const netPaise = owedToYouPaise - youOwePaise;
  const isPositive = netPaise >= 0;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-cyan-400/15 dark:bg-gradient-to-br dark:from-[#0C2434]/95 dark:via-[#091826]/95 dark:to-[#07111B]/95 dark:shadow-none">
      {/* Subtle curved horizon glow on the right side matching the mockup */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-12 h-48 w-72 rounded-full border border-cyan-300/15 opacity-0 dark:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse at 60% 20%, rgba(45, 212, 191, 0.14) 0%, transparent 70%)',
        }}
      />

      {/* Top Row: Custom 3-bar signal icon + Title + Trend icon */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-end gap-[2px] h-3.5" aria-hidden="true">
            <span className="w-[3px] h-1.5 rounded-xs bg-teal-500 dark:bg-teal-400" />
            <span className="w-[3px] h-2.5 rounded-xs bg-teal-500 dark:bg-teal-400" />
            <span className="w-[3px] h-3.5 rounded-xs bg-cyan-500 dark:bg-cyan-300" />
          </span>
          <h2 className="text-xs font-medium text-slate-600 dark:text-slate-200">
            Your Financial Overview
          </h2>
        </div>

        <button
          type="button"
          onClick={onAnalyticsClick}
          aria-label="View financial trends"
          className="rounded-lg p-1 text-teal-600 transition hover:bg-slate-900/5 active:scale-95 dark:text-teal-300 dark:hover:bg-white/5"
        >
          <TrendingUp className="h-4 w-4" />
        </button>
      </div>

      {/* Hero Balance (Mint/Cyan in Dark Mode) */}
      <div className="relative z-10 mt-2.5">
        <p className="text-[34px] leading-tight font-bold tracking-tight text-teal-600 dark:text-[#3CE8C6]">
          {formatINR(Math.abs(netPaise))}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {isPositive ? 'Total amount you are owed' : 'Total amount you owe'}
        </p>
      </div>

      {/* Bottom Two-Column Breakdown (No horizontal divider, solid icon circles) */}
      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
        {/* You are owed */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/25">
            <ArrowUp className="h-4 w-4" strokeWidth={2.75} />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              You are owed
            </p>
            <p className="text-base font-bold text-emerald-600 dark:text-[#2EE59D]">
              {formatINR(owedToYouPaise)}
            </p>
          </div>
        </div>

        {/* You owe */}
        <div className="flex items-center gap-3 border-l border-slate-200/80 pl-3.5 dark:border-white/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B86835] text-white shadow-sm">
            <ArrowDown className="h-4 w-4" strokeWidth={2.75} />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              You owe
            </p>
            <p className="text-base font-bold text-orange-600 dark:text-[#F59E56]">
              {formatINR(youOwePaise)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}