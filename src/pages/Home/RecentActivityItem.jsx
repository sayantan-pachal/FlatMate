import { ShoppingCart, Zap, ReceiptText } from 'lucide-react';
import { formatINR } from '../../lib/currency';

const CATEGORY_ICON = {
  grocery: ShoppingCart,
  electricity: Zap,
  default: ReceiptText,
};

export default function RecentActivityItem({ item, onClick }) {
  const Icon = CATEGORY_ICON[item.category] || CATEGORY_ICON.default;

  return (
    <div
      onClick={() => onClick?.(item.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(item.id)}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl py-1.5 transition active:scale-[0.99]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600 dark:bg-[#192844] dark:text-sky-300">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {item.title}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {item.roomName} · {item.timestampLabel}
          </p>
        </div>
      </div>

      <span className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
        {formatINR(item.amountPaise, { showDecimals: false })}
      </span>
    </div>
  );
}