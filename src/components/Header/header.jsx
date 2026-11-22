import { Bell } from 'lucide-react';
import ThemeToggle from "./ThemeToggle";

export default function TopHeader({
  unreadCount = 2,
  onNotificationClick,
  onProfileClick,
}) {

  return (
    <header className="mx-auto flex w-full max-w-md items-center justify-between px-5 pt-6 pb-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          FlatMate
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          onClick={onNotificationClick}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition active:scale-95 hover:bg-white/5"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#07111A]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onProfileClick}
          aria-label="User profile"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/20 bg-slate-800/90 text-sm font-semibold text-white transition active:scale-95 hover:border-sky-400/40"
        >
          U
        </button>
      </div>
    </header>
  );
}