import { useState } from 'react';
import {
  Home,
  ReceiptText,
  Users,
  User,
  Plus,
  Split,
  DoorOpen,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const LEFT_TABS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/expenses', label: 'Expenses', icon: ReceiptText },
];

const RIGHT_TABS = [
  { to: '/rooms', label: 'Rooms', icon: Users },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    setMenuOpen((prev) => !prev);
  };

  const handleActionSelect = (path) => {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    setMenuOpen(false);
    navigate(path);
  };

  const renderTab = ({ to, label, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/'}
      onClick={() => setMenuOpen(false)}
      className={({ isActive }) =>
        `relative flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition ${
          isActive
            ? 'text-teal-600 dark:text-teal-300'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`h-5 w-5 ${
              isActive
                ? 'text-teal-600 dark:text-teal-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
            strokeWidth={isActive ? 2.25 : 1.85}
          />
          <span>{label}</span>
          {isActive && (
            <span className="absolute bottom-0.5 h-0.5 w-8 rounded-full bg-teal-600 dark:bg-teal-300" />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Dimmed Backdrop when Quick-Action Menu is open */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Floating Quick-Action Options above the '+' button */}
      {menuOpen && (
        <div className="fixed bottom-22 left-0 right-0 z-30 mx-auto w-full max-w-md px-6">
          <div className="mx-auto flex max-w-[270px] flex-col gap-2.5 rounded-3xl border border-slate-200/80 bg-white/95 p-2.5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0E1B2B]/95">
            {/* Option 1: Add / Split Expense */}
            <button
              type="button"
              onClick={() => handleActionSelect('/split-expense')}
              className="flex w-full cursor-pointer items-center gap-3.5 rounded-2xl p-2.5 text-left transition active:scale-[0.98] hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:bg-[#133840] dark:text-[#34E8C5]">
                <Split className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Split Expense
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Add a bill &amp; split with flatmates
                </p>
              </div>
            </button>

            {/* Option 2: Create / Join Room */}
            <button
              type="button"
              onClick={() => handleActionSelect('/rooms/new')}
              className="flex w-full cursor-pointer items-center gap-3.5 rounded-2xl p-2.5 text-left transition active:scale-[0.98] hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:bg-[#192D52] dark:text-sky-300">
                <DoorOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Create or Join Room
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Start a new space or enter code
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-[#F7F8FA]/90 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-[#070A0F]/95">
        <div className="mx-auto grid max-w-md grid-cols-5 items-center px-2 pt-1 pb-2">
          {LEFT_TABS.map(renderTab)}

          {/* Center Floating '+' / '×' Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close quick actions' : 'Open quick actions'}
              className={`-mt-7 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-linear-to-tr from-teal-500 to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/25 ring-4 ring-[#F7F8FA] transition-transform duration-200 active:scale-95 dark:from-teal-400 dark:to-cyan-300 dark:ring-[#070A0F] ${
                menuOpen ? 'rotate-45' : 'rotate-0'
              }`}
            >
              <Plus className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </div>

          {RIGHT_TABS.map(renderTab)}
        </div>
      </footer>
    </>
  );
}