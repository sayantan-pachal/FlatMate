import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinancialOverview from './FinancialOverview';
import SpaceCard from './SpaceCard';
import RecentActivityItem from './RecentActivityItem';

const MOCK_ROOMS = [
  {
    id: 'room_hostel',
    name: 'Hostel',
    iconType: 'hostel',
    memberCount: 3,
    typeLabel: 'Shared Living',
    netBalancePaise: -6268,
    monthlyExpensesPaise: 345000,
    occupancyDays: 30,
  },
  {
    id: 'room_home',
    name: 'My Home',
    iconType: 'home',
    memberCount: 2,
    typeLabel: 'Personal Space',
    netBalancePaise: 27500,
    recentNote: 'Electricity bill settled',
  },
];

const MOCK_ACTIVITY = [
  {
    id: 'exp_1',
    title: 'Grocery expense',
    category: 'grocery',
    roomName: 'Hostel',
    timestampLabel: 'Today, 8:12 PM',
    amountPaise: 45000,
  },
];

export default function HomePage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-md bg-transparent px-5 pt-1 pb-6">
      <div className="mb-4">
        <p className="text-base font-normal leading-snug text-slate-600 dark:text-slate-300">
          {greeting},
        </p>
        <h1 className="mt-0.5 text-[26px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          Buddy! <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Manage. Share. Settle.
        </p>
      </div>

      {/* 1. Financial Overview Card */}
      <FinancialOverview
        owedToYouPaise={27500}
        youOwePaise={6268}
        onAnalyticsClick={() => navigate('/expenses')}
      />

      {/* 2. Your Spaces Section */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Your Spaces
          </h2>
          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="text-xs font-semibold text-teal-600 transition hover:opacity-80 dark:text-teal-300"
          >
            + New Room
          </button>
        </div>

        <div className="space-y-3">
          {MOCK_ROOMS.map((room) => (
            <SpaceCard
              key={room.id}
              room={room}
              onOpenRoom={(roomId) => navigate(`/rooms/${roomId}`)}
            />
          ))}
        </div>
      </section>

      {/* 3. Recent Activity Section */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h2>
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 transition hover:opacity-80 dark:text-teal-300"
          >
            <span>See All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {MOCK_ACTIVITY.map((item) => (
            <RecentActivityItem
              key={item.id}
              item={item}
              onClick={() => navigate('/expenses')}
            />
          ))}
        </div>
      </section>
    </div>
  );
}