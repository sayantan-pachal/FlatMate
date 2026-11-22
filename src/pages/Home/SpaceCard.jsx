import {
  ChevronRight,
  Wallet,
  CalendarDays,
  Sparkles,
  Building2,
  Home,
} from 'lucide-react';
import { formatINR } from '../../lib/currency';

export default function SpaceCard({ room, onOpenRoom }) {
  const isOwed = room.netBalancePaise > 0;
  const isSettled = room.netBalancePaise === 0;
  const FallbackIcon = room.iconType === 'hostel' ? Building2 : Home;

  return (
    <article
      onClick={() => onOpenRoom(room.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenRoom(room.id)}
      className="group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 shadow-sm backdrop-blur-md transition active:scale-[0.99] hover:border-teal-500/40 dark:border-white/10 dark:bg-[#0D1826]/85 dark:shadow-none dark:hover:border-teal-400/30"
    >
      {/* Left: Large Rounded Square Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200/60 bg-gradient-to-br from-sky-900 via-indigo-950 to-slate-900 dark:border-white/10">
        {room.thumbnailUrl ? (
          <img
            src={room.thumbnailUrl}
            alt={room.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sky-600/30 via-indigo-900/60 to-slate-950 text-amber-300">
            <FallbackIcon className="h-7 w-7 drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]" />
          </div>
        )}
      </div>

      {/* Right: All Room Info Stacked Beside the Thumbnail */}
      <div className="min-w-0 flex-1">
        {/* Title + Balance Pill + Chevron */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
            {room.name}
          </h3>

          <div className="flex shrink-0 items-center gap-1">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                isSettled
                  ? 'bg-slate-200/80 text-slate-600 dark:bg-white/10 dark:text-slate-300'
                  : isOwed
                  ? 'bg-emerald-500/20 text-emerald-700 dark:bg-[#155948] dark:text-[#4AE8B5]'
                  : 'bg-orange-500/20 text-orange-700 dark:bg-[#5E3920] dark:text-[#F6A35E]'
              }`}
            >
              {isSettled
                ? 'Settled'
                : `${isOwed ? 'You are owed' : 'You owe'} ${formatINR(
                    Math.abs(room.netBalancePaise),
                    { showDecimals: !Number.isInteger(room.netBalancePaise / 100) }
                  )}`}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-400" />
          </div>
        </div>

        {/* Member Count Subtitle */}
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
          {room.memberCount} {room.memberCount === 1 ? 'member' : 'members'} ·{' '}
          {room.typeLabel}
        </p>

        {/* Bottom Stats or Recent Note */}
        {room.monthlyExpensesPaise !== undefined &&
        room.occupancyDays !== undefined ? (
          <div className="mt-2.5 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Wallet className="h-5 w-5 shrink-0 text-slate-400" />
              <div>
                <p className="text-[10px] leading-none text-slate-400">
                  Monthly Expenses
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {formatINR(room.monthlyExpensesPaise)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-5 w-5 shrink-0 text-slate-400" />
              <div>
                <p className="text-[10px] leading-none text-slate-400">
                  This Month
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {room.occupancyDays} {room.occupancyDays === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>
          </div>
        ) : room.recentNote ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500 dark:text-amber-400" />
            <span className="truncate">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Recent:
              </span>{' '}
              {room.recentNote}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}