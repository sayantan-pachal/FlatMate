import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Zap,
  Home,
  Utensils,
  ReceiptText,
  Users,
  IndianRupee,
  PieChart,
  Layers,
  ChevronDown,
  Check,
  Building2,
  User,
} from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import CustomDropdown from '../../components/ui/CustomDropdown';
import { formatINR, toPaise } from '../../lib/currency';

const CATEGORIES = [
  { id: 'grocery', label: 'Grocery', icon: ShoppingCart },
  { id: 'electricity', label: 'Electricity', icon: Zap },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'rent', label: 'Rent', icon: Home },
  { id: 'other', label: 'Other', icon: ReceiptText },
];

const MOCK_ROOMS = [
  {
    id: 'room_hostel',
    name: 'Hostel',
    members: [
      { id: 'u_1', name: 'Sayantan Pachal', initials: 'SP', avatarUrl: '' },
      { id: 'u_2', name: 'Samir Bera', initials: 'SB', avatarUrl: '' },
      { id: 'u_3', name: 'PRITAM DHARA', initials: 'PD', avatarUrl: '' },
    ],
  },
  {
    id: 'room_home',
    name: 'My Home',
    members: [
      { id: 'u_1', name: 'Sayantan Pachal', initials: 'SP', avatarUrl: '' },
      { id: 'u_4', name: 'Rituraj Saha', initials: 'RS', avatarUrl: '' },
    ],
  },
];

const SPLIT_MODES = [
  { id: 'equal', label: 'Equal', icon: Users },
  { id: 'amount', label: 'Amount', icon: IndianRupee },
  { id: 'percentage', label: 'Percentage', icon: PieChart },
  { id: 'shares', label: 'Shares', icon: Layers },
];

export default function SplitExpensePage({
  rooms = MOCK_ROOMS,
  lockedRoomId: propLockedRoomId = null,
  onConfirm,
}) {
  const navigate = useNavigate();
  const { roomId: paramRoomId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Detect if opened from inside a specific room (prop, route param, router state, or query)
  const lockedRoomId =
    propLockedRoomId ||
    paramRoomId ||
    location.state?.roomId ||
    searchParams.get('roomId') ||
    null;

  const isRoomLocked = Boolean(
    lockedRoomId && rooms.some((r) => r.id === lockedRoomId)
  );

  // Step control: 'details' (Step 1) -> 'split' (Step 2)
  const [step, setStep] = useState('details');

  // Step 1: Expense Entry State
  const [amountInput, setAmountInput] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('grocery');
  const [selectedRoomId, setSelectedRoomId] = useState(
    () => (isRoomLocked ? lockedRoomId : rooms[0]?.id || '')
  );
  const [paidById, setPaidById] = useState(() => {
    const initialRoom =
      rooms.find((r) => r.id === (isRoomLocked ? lockedRoomId : rooms[0]?.id)) ||
      rooms[0];
    return initialRoom?.members[0]?.id || '';
  });

  // Sync lockedRoomId if route/context changes
  useEffect(() => {
    if (isRoomLocked && lockedRoomId) {
      setSelectedRoomId(lockedRoomId);
      const room = rooms.find((r) => r.id === lockedRoomId);
      if (room) {
        setPaidById(room.members[0]?.id || '');
        setSelectedIds(room.members.map((m) => m.id));
      }
    }
  }, [isRoomLocked, lockedRoomId, rooms]);

  // Active Room & Members
  const activeRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) || rooms[0],
    [rooms, selectedRoomId]
  );
  const members = activeRoom?.members || [];

  // Dropdown Options
  const roomOptions = useMemo(
    () =>
      rooms.map((r) => ({
        value: r.id,
        label: r.name,
        icon: <Building2 className="h-4 w-4 text-teal-600 dark:text-[#34E8C5]" />,
      })),
    [rooms]
  );

  const memberOptions = useMemo(
    () =>
      members.map((m) => ({
        value: m.id,
        label: m.name.split(' ')[0],
        icon: <User className="h-4 w-4 text-slate-400" />,
      })),
    [members]
  );

  // Step 2: Split Configuration State
  const [splitMode, setSplitMode] = useState('equal');
  const [selectedIds, setSelectedIds] = useState(() => members.map((m) => m.id));
  const [customValues, setCustomValues] = useState({});

  const totalPaise = toPaise(amountInput);
  const activeCategory =
    CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const CategoryIcon = activeCategory.icon;

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  // Handle Room Switch (only allowed when isRoomLocked is false)
  const handleRoomChange = (roomId) => {
    if (isRoomLocked) return;
    setSelectedRoomId(roomId);
    const nextRoom = rooms.find((r) => r.id === roomId);
    if (nextRoom) {
      setPaidById(nextRoom.members[0]?.id || '');
      setSelectedIds(nextRoom.members.map((m) => m.id));
      setCustomValues({});
    }
  };

  const handleContinueToSplit = (e) => {
    e.preventDefault();
    if (totalPaise <= 0 || !title.trim()) return;
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    if (selectedIds.length === 0) {
      setSelectedIds(members.map((m) => m.id));
    }
    setStep('split');
  };

  const handleBack = () => {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    if (step === 'split') {
      setStep('details');
    } else {
      navigate(-1);
    }
  };

  const toggleMember = (id) => {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    if (selectedIds.length === members.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(members.map((m) => m.id));
    }
  };

  const handleModeChange = (modeId) => {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    setSplitMode(modeId);
    if (modeId === 'shares') {
      setCustomValues(Object.fromEntries(members.map((m) => [m.id, '1'])));
    } else {
      setCustomValues(Object.fromEntries(members.map((m) => [m.id, ''])));
    }
  };

  const splitSummary = useMemo(() => {
    const activeMembers = members.filter((m) => selectedIds.includes(m.id));
    const count = activeMembers.length;

    if (count === 0) {
      return {
        perMemberPaise: {},
        displayPaise: 0,
        isValid: false,
        error: 'Select at least 1 member',
      };
    }

    if (splitMode === 'equal') {
      const baseShare = Math.floor(totalPaise / count);
      const remainder = totalPaise - baseShare * count;
      const perMemberPaise = {};

      activeMembers.forEach((m, idx) => {
        perMemberPaise[m.id] = baseShare + (idx < remainder ? 1 : 0);
      });

      return {
        perMemberPaise,
        displayPaise: baseShare,
        isValid: true,
        error: null,
      };
    }

    if (splitMode === 'amount') {
      const perMemberPaise = {};
      let sumPaise = 0;

      activeMembers.forEach((m) => {
        const val = toPaise(customValues[m.id]);
        perMemberPaise[m.id] = val;
        sumPaise += val;
      });

      const diff = totalPaise - sumPaise;
      return {
        perMemberPaise,
        displayPaise: sumPaise,
        isValid: diff === 0,
        error:
          diff === 0
            ? null
            : diff > 0
            ? `${formatINR(diff)} remaining to allocate`
            : `${formatINR(Math.abs(diff))} over total amount`,
      };
    }

    if (splitMode === 'percentage') {
      const perMemberPaise = {};
      let sumPct = 0;
      let allocatedPaise = 0;

      activeMembers.forEach((m, idx) => {
        const pct = Number(customValues[m.id] || 0);
        sumPct += pct;
        if (idx === activeMembers.length - 1 && Math.abs(sumPct - 100) < 0.01) {
          perMemberPaise[m.id] = totalPaise - allocatedPaise;
        } else {
          const share = Math.round((totalPaise * pct) / 100);
          perMemberPaise[m.id] = share;
          allocatedPaise += share;
        }
      });

      const isValid = Math.abs(sumPct - 100) < 0.01;
      return {
        perMemberPaise,
        displayPaise: allocatedPaise,
        isValid,
        error: isValid
          ? null
          : `Total percentage is ${sumPct.toFixed(1)}% (must be 100%)`,
      };
    }

    const totalShares = activeMembers.reduce(
      (acc, m) => acc + Math.max(0, Number(customValues[m.id] || 0)),
      0
    );

    if (totalShares <= 0) {
      return {
        perMemberPaise: {},
        displayPaise: 0,
        isValid: false,
        error: 'Enter at least 1 share',
      };
    }

    const perMemberPaise = {};
    let allocatedPaise = 0;

    activeMembers.forEach((m, idx) => {
      const shares = Math.max(0, Number(customValues[m.id] || 0));
      if (idx === activeMembers.length - 1) {
        perMemberPaise[m.id] = totalPaise - allocatedPaise;
      } else {
        const sharePaise = Math.round((totalPaise * shares) / totalShares);
        perMemberPaise[m.id] = sharePaise;
        allocatedPaise += sharePaise;
      }
    });

    return {
      perMemberPaise,
      displayPaise: Math.round(totalPaise / totalShares),
      isValid: true,
      error: null,
    };
  }, [members, selectedIds, splitMode, customValues, totalPaise]);

  const handleConfirm = () => {
    if (!splitSummary.isValid) return;
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});

    const payload = {
      title: title.trim(),
      category: categoryId,
      roomId: activeRoom.id,
      roomName: activeRoom.name,
      paidById,
      amountPaise: totalPaise,
      splitMode,
      splits: splitSummary.perMemberPaise,
      createdAt: new Date().toISOString(),
    };

    if (onConfirm) {
      onConfirm(payload);
    } else {
      navigate(-1);
    }
  };

  const allSelected = selectedIds.length === members.length;
  const canContinue = totalPaise > 0 && title.trim().length > 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-transparent px-5 pt-4 pb-8 text-slate-900 dark:text-white">
      {/* Top Sub-Page Header */}
      <header className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-700 transition active:scale-95 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">
            {step === 'details' ? 'Add Expense' : 'Split Expense'}
          </h1>
        </div>

        <span className="rounded-full border border-slate-200/80 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          Step {step === 'details' ? '1' : '2'} of 2
        </span>
      </header>

      {/* ========================================================= */}
      {/* STEP 1: ENTER AMOUNT, TITLE, ROOM & PAID BY               */}
      {/* ========================================================= */}
      {step === 'details' ? (
        <form
          onSubmit={handleContinueToSplit}
          className="mt-3 flex flex-1 flex-col justify-between"
        >
          <div className="space-y-5">
            {/* Hero Amount Input Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 text-center shadow-sm backdrop-blur-xl dark:border-cyan-400/15 dark:bg-gradient-to-br dark:from-[#0C2434]/95 dark:to-[#08131E]/95 dark:shadow-none">
              <label
                htmlFor="expense-amount"
                className="text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                Enter total amount
              </label>

              <div className="mt-2 flex items-center justify-center gap-1">
                <span className="text-3xl font-bold text-teal-600 dark:text-[#34E8C5]">
                  ₹
                </span>
                <input
                  id="expense-amount"
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="any"
                  autoFocus
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0"
                  className="w-44 bg-transparent text-center text-4xl font-bold tracking-tight text-slate-900 placeholder:text-slate-300 focus:outline-none dark:text-white dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Expense Title Input */}
            <div>
              <label
                htmlFor="expense-title"
                className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                What is this expense for?
              </label>
              <input
                id="expense-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Grocery Shopping, WiFi Bill"
                className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 backdrop-blur-md focus:border-teal-500 focus:outline-none dark:border-white/10 dark:bg-[#0E1B2B]/85 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#34E8C5]"
              />
            </div>

            {/* Category Selector */}
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map(({ id, label, icon: Icon }) => {
                  const active = categoryId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCategoryId(id)}
                      className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        active
                          ? 'border-teal-500 bg-teal-500/15 text-teal-700 dark:border-[#34E8C5] dark:bg-[#102E38] dark:text-[#34E8C5]'
                          : 'border-slate-200/80 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-[#0D1826]/80 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room & Paid By Custom Dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Space / Room</span>
                  {isRoomLocked && (
                    <span className="text-[10px] font-medium text-teal-600 dark:text-[#34E8C5]">
                      Locked
                    </span>
                  )}
                </p>
                <CustomDropdown
                  value={selectedRoomId}
                  onChange={handleRoomChange}
                  options={roomOptions}
                  placeholder="Select room"
                  disabled={isRoomLocked}
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Paid by
                </p>
                <CustomDropdown
                  value={paidById}
                  onChange={setPaidById}
                  options={memberOptions}
                  placeholder="Paid by"
                />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!canContinue}
            className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/25 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 dark:from-[#2EE5C2] dark:to-[#18C9A7]"
          >
            <span>Continue to Split</span>
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </form>
      ) : (
        /* ========================================================= */
        /* STEP 2: SPLIT EXPENSE                                     */
        /* ========================================================= */
        <>
          <section
            onClick={() => setStep('details')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setStep('details')}
            className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md transition hover:border-teal-500/40 dark:border-white/10 dark:bg-[#0E1B2B]/85 dark:shadow-none"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600 dark:bg-[#19325C] dark:text-sky-200">
                <CategoryIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-slate-900 dark:text-white">
                  {title.trim()}
                </h2>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {activeRoom?.name} · {formattedDate}
                </p>
              </div>
            </div>

            <span className="shrink-0 text-xl font-bold text-slate-900 dark:text-white">
              {formatINR(totalPaise, {
                showDecimals: !Number.isInteger(totalPaise / 100),
              })}
            </span>
          </section>

          <section className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              How to split?
            </h3>

            <div className="grid grid-cols-4 gap-2.5">
              {SPLIT_MODES.map(({ id, label, icon: Icon }) => {
                const isActive = splitMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleModeChange(id)}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border py-3 px-1.5 text-xs font-medium transition active:scale-95 ${
                      isActive
                        ? 'border-teal-500 bg-teal-500/10 text-teal-700 shadow-sm dark:border-[#34E8C5] dark:bg-[#102E38] dark:text-[#34E8C5]'
                        : 'border-slate-200/80 bg-white/70 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-[#0D1826]/80 dark:text-slate-400 dark:hover:border-white/20'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? 'text-teal-600 dark:text-[#34E8C5]'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-6 flex-1">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Select members
              </h3>

              <button
                type="button"
                onClick={toggleSelectAll}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-teal-600 transition hover:opacity-80 dark:text-[#34E8C5]"
              >
                <span>
                  {allSelected
                    ? `All selected (${members.length})`
                    : `Selected (${selectedIds.length}/${members.length})`}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {members.map((member) => {
                const isChecked = selectedIds.includes(member.id);
                return (
                  <div
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleMember(member.id)}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3.5 py-2.5 shadow-sm backdrop-blur-md transition active:scale-[0.99] dark:border-white/10 dark:bg-[#0E1B2B]/85 dark:shadow-none"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/15"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-bold text-white ring-1 ring-white/15">
                          {member.initials}
                        </div>
                      )}

                      <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {member.name}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      {isChecked && splitMode !== 'equal' && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center rounded-lg border border-slate-300 bg-slate-100 px-2 py-1 dark:border-white/15 dark:bg-slate-900/90"
                        >
                          {splitMode === 'amount' && (
                            <span className="mr-1 text-xs text-slate-400">₹</span>
                          )}
                          <input
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="any"
                            value={customValues[member.id] ?? ''}
                            onChange={(e) =>
                              setCustomValues((prev) => ({
                                ...prev,
                                [member.id]: e.target.value,
                              }))
                            }
                            placeholder="0"
                            className="w-14 bg-transparent text-right text-xs font-semibold text-slate-900 focus:outline-none dark:text-white"
                          />
                          {splitMode === 'percentage' && (
                            <span className="ml-1 text-xs text-slate-400">%</span>
                          )}
                          {splitMode === 'shares' && (
                            <span className="ml-1 text-[10px] text-slate-400">x</span>
                          )}
                        </div>
                      )}

                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-lg border transition ${
                          isChecked
                            ? 'border-teal-500 bg-teal-500 text-slate-950 dark:border-[#2EE5C2] dark:bg-[#2EE5C2]'
                            : 'border-slate-300 bg-transparent dark:border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="h-4 w-4" strokeWidth={3} />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur-xl dark:border-cyan-400/15 dark:bg-gradient-to-r dark:from-[#0C2032]/95 dark:to-[#0A1626]/95 dark:shadow-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full border border-cyan-300/20 opacity-0 dark:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.9) 70%)',
              }}
            />

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:bg-teal-400/10 dark:text-[#34E8C5]">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {splitMode === 'equal'
                    ? 'Each will pay'
                    : splitMode === 'shares'
                    ? 'Per share value'
                    : 'Total allocated'}
                </p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-teal-600 dark:text-[#34E8C5]">
                  {formatINR(splitSummary.displayPaise)}
                </p>
                {splitSummary.error && (
                  <p className="mt-0.5 text-[11px] font-medium text-orange-600 dark:text-orange-400">
                    {splitSummary.error}
                  </p>
                )}
              </div>
            </div>
          </section>

          <button
            type="button"
            disabled={!splitSummary.isValid}
            onClick={handleConfirm}
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/25 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 dark:from-[#2EE5C2] dark:to-[#18C9A7]"
          >
            <Check className="h-4 w-4" strokeWidth={2.75} />
            <span>Confirm Split</span>
          </button>
        </>
      )}
    </div>
  );
}