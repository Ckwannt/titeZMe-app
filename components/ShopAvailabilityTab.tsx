'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/lib/toast';
import { getLocalDateString, getTimezoneFromLocation } from '@/lib/schedule-utils';

// ─── Types ─────────────────────────────────────────────────────────────────

type DayHours = {
  isOpen: boolean;
  open: string;
  close: string;
  breakStart?: string;
  breakEnd?: string;
  hasBreak?: boolean;
};

type WeeklyHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

type BlockedDate = { date: string; reason?: string };

const DAYS: Array<{ key: keyof WeeklyHours; label: string }> = [
  { key: 'monday',    label: 'Monday' },
  { key: 'tuesday',   label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday',  label: 'Thursday' },
  { key: 'friday',    label: 'Friday' },
  { key: 'saturday',  label: 'Saturday' },
  { key: 'sunday',    label: 'Sunday' },
];

const DEFAULT_DAY: DayHours = { isOpen: true, open: '09:00', close: '19:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' };
const CLOSED_DAY: DayHours = { isOpen: false, open: '09:00', close: '19:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' };

const DEFAULT_HOURS: WeeklyHours = {
  monday:    { ...DEFAULT_DAY },
  tuesday:   { ...DEFAULT_DAY },
  wednesday: { ...DEFAULT_DAY },
  thursday:  { ...DEFAULT_DAY },
  friday:    { ...DEFAULT_DAY },
  saturday:  { ...DEFAULT_DAY, open: '10:00', close: '18:00' },
  sunday:    { ...CLOSED_DAY },
};

const SPAIN_2026 = ['2026-01-01','2026-01-06','2026-04-02','2026-04-03','2026-05-01','2026-08-15','2026-10-12','2026-11-01','2026-12-06','2026-12-08','2026-12-25'];
const MOROCCO_2026 = ['2026-01-01','2026-01-11','2026-03-03','2026-04-30','2026-05-01','2026-07-30','2026-08-14','2026-08-20','2026-11-06','2026-11-18'];
const FRANCE_2026 = ['2026-01-01','2026-04-06','2026-05-01','2026-05-08','2026-05-14','2026-05-25','2026-07-14','2026-08-15','2026-11-01','2026-11-11','2026-12-25'];
const UK_2026 = ['2026-01-01','2026-04-03','2026-04-06','2026-05-04','2026-05-25','2026-08-31','2026-12-25','2026-12-28'];

const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 23) TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:30`);
}

interface ShopAvailabilityTabProps {
  schedule: any;
  mutateSchedule: () => void;
}

export function ShopAvailabilityTab({ schedule, mutateSchedule }: ShopAvailabilityTabProps) {
  const { user } = useAuth();
  const [hours, setHours] = useState<WeeklyHours>(DEFAULT_HOURS);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [newClosureDate, setNewClosureDate] = useState('');
  const [newClosureReason, setNewClosureReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  // Load from schedule prop on mount
  useEffect(() => {
    if (!schedule) return;
    if (schedule.weeklyHours) {
      setHours({ ...DEFAULT_HOURS, ...schedule.weeklyHours });
    }
    if (schedule.blockedDates) {
      const parsed: BlockedDate[] = (schedule.blockedDates as any[]).map((d: any) =>
        typeof d === 'string' ? { date: d } : { date: d.date, reason: d.reason }
      );
      setBlockedDates(parsed);
    }
  }, [schedule]);

  // ── Day row helpers ───────────────────────────────────────────────────────
  const updateDay = (day: keyof WeeklyHours, patch: Partial<DayHours>) => {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  };

  const copyMonToWeekdays = () => {
    const mon = hours.monday;
    setHours(prev => ({
      ...prev,
      tuesday: { ...mon },
      wednesday: { ...mon },
      thursday: { ...mon },
      friday: { ...mon },
    }));
    toast.success('Monday hours copied to Tue–Fri');
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'schedules', `${user.uid}_shard_0`), {
        ownerId: user.uid,
        weeklyHours: hours,
        blockedDates,
        updatedAt: Date.now(),
      }, { merge: true });
      mutateSchedule();
      setLastSaved(Date.now());
      toast.success('Shop hours saved!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save hours.');
    }
    setSaving(false);
  };

  // ── Closures ──────────────────────────────────────────────────────────────
  const addClosure = () => {
    if (!newClosureDate) return;
    if (blockedDates.some(d => d.date === newClosureDate)) {
      toast.error('Date already added');
      return;
    }
    setBlockedDates(prev => [...prev, { date: newClosureDate, reason: newClosureReason || undefined }]);
    setNewClosureDate('');
    setNewClosureReason('');
  };

  const removeClosure = (date: string) => {
    setBlockedDates(prev => prev.filter(d => d.date !== date));
  };

  const addHolidays = (country: string) => {
    const map: Record<string, string[]> = { spain: SPAIN_2026, morocco: MOROCCO_2026, france: FRANCE_2026, uk: UK_2026 };
    const holidays = map[country] || [];
    const toAdd = holidays.filter(h => !blockedDates.some(d => d.date === h));
    if (toAdd.length === 0) { toast.success('All holidays already added'); return; }
    const names: Record<string, string> = {
      '2026-01-01': 'New Year', '2026-01-06': 'Epiphany', '2026-04-02': 'Good Friday', '2026-04-03': 'Holy Saturday',
      '2026-05-01': 'Labour Day', '2026-08-15': 'Assumption', '2026-10-12': 'National Day',
      '2026-11-01': "All Saints'", '2026-12-06': 'Constitution Day', '2026-12-08': 'Immaculate Conception',
      '2026-12-25': 'Christmas', '2026-01-11': 'Independence Manifesto', '2026-03-03': 'Throne Day',
      '2026-07-30': 'Throne Day', '2026-08-14': 'Oued Ed-Dahab', '2026-08-20': 'Revolution Day',
      '2026-11-06': 'Green March', '2026-11-18': 'Independence Day', '2026-04-06': 'Easter Monday',
      '2026-05-08': 'Victory Day', '2026-05-14': 'Ascension', '2026-05-25': 'Whit Monday',
      '2026-07-14': 'Bastille Day', '2026-11-11': 'Armistice Day', '2026-04-30': 'Morocco Festival',
      '2026-05-04': 'Early May BH', '2026-08-31': 'Summer BH', '2026-12-28': 'Boxing Day+',
    };
    setBlockedDates(prev => [...prev, ...toAdd.map(d => ({ date: d, reason: names[d] || 'Public holiday' }))]);
    toast.success(`Added ${toAdd.length} holidays`);
  };

  const todayMin = getLocalDateString();

  return (
    <div className="animate-fadeUp max-w-2xl">
      <div className="mb-7">
        <h1 className="text-2xl font-black mb-1">Shop Hours ⏰</h1>
        <p className="text-[#888] text-sm">Set when your shop is open. Each barber manages their own individual availability.</p>
      </div>

      {/* ── WEEKLY HOURS ───────────────────────────────────────────────────── */}
      <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 mb-6">
        <h2 className="text-base font-black mb-5">Regular hours</h2>
        <div className="flex flex-col gap-4">
          {DAYS.map(({ key, label }, idx) => {
            const day = hours[key];
            return (
              <div key={key} className={`rounded-xl p-4 transition-colors ${day.isOpen ? 'bg-[#0f0f0f] border border-[#1e1e1e]' : 'bg-[#0a0a0a] border border-[#141414] opacity-60'}`}>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Toggle */}
                  <button
                    onClick={() => updateDay(key, { isOpen: !day.isOpen })}
                    className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${day.isOpen ? 'bg-brand-yellow' : 'bg-[#2a2a2a]'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${day.isOpen ? 'left-5' : 'left-0.5'}`} />
                  </button>

                  {/* Day name */}
                  <span className="font-extrabold text-sm w-[90px] shrink-0">{label}</span>

                  {day.isOpen ? (
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      <span className="text-[11px] text-[#666]">Opens</span>
                      <select value={day.open} onChange={e => updateDay(key, { open: e.target.value })}
                        className="bg-[#141414] border border-[#2a2a2a] text-white rounded-lg px-2 py-1.5 text-sm outline-none">
                        {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className="text-[#555]">→</span>
                      <select value={day.close} onChange={e => updateDay(key, { close: e.target.value })}
                        className="bg-[#141414] border border-[#2a2a2a] text-white rounded-lg px-2 py-1.5 text-sm outline-none">
                        {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {idx === 0 && (
                        <button onClick={copyMonToWeekdays}
                          className="text-[10px] font-bold text-brand-yellow hover:underline ml-2 whitespace-nowrap">
                          Copy to Tue–Fri
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[12px] text-[#555] font-bold">Closed</span>
                  )}
                </div>

                {/* Break row */}
                {day.isOpen && (
                  <div className="mt-2.5 pl-[52px]">
                    {!day.hasBreak ? (
                      <button onClick={() => updateDay(key, { hasBreak: true })}
                        className="text-[10px] text-[#555] hover:text-[#888] font-bold transition-colors">
                        + Add lunch break
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-[#666]">Break</span>
                        <select value={day.breakStart} onChange={e => updateDay(key, { breakStart: e.target.value })}
                          className="bg-[#141414] border border-[#2a2a2a] text-white rounded-lg px-2 py-1.5 text-xs outline-none">
                          {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="text-[#555]">→</span>
                        <select value={day.breakEnd} onChange={e => updateDay(key, { breakEnd: e.target.value })}
                          className="bg-[#141414] border border-[#2a2a2a] text-white rounded-lg px-2 py-1.5 text-xs outline-none">
                          {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button onClick={() => updateDay(key, { hasBreak: false })}
                          className="text-[10px] text-[#555] hover:text-brand-red font-bold ml-1">
                          Remove break
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full bg-brand-yellow text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-400 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Shop Hours'}
        </button>
        {lastSaved && (
          <div className="mt-2 text-[10px] text-[#555] text-center">
            Last saved: {new Date(lastSaved).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* ── SPECIAL CLOSURES ───────────────────────────────────────────────── */}
      <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 mb-6">
        <h2 className="text-base font-black mb-1">Special closures</h2>
        <p className="text-[#888] text-xs mb-5">Add specific dates when your shop will be closed.</p>

        <div className="flex gap-2 mb-5 flex-wrap">
          <input type="date" min={todayMin} value={newClosureDate}
            onChange={e => setNewClosureDate(e.target.value)}
            className="bg-[#141414] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-yellow transition-colors" />
          <input type="text" placeholder="Reason (optional)" value={newClosureReason}
            onChange={e => setNewClosureReason(e.target.value)}
            className="flex-1 min-w-[140px] bg-[#141414] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-yellow transition-colors" />
          <button onClick={addClosure} disabled={!newClosureDate}
            className="bg-brand-yellow text-black px-5 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-400 disabled:opacity-50 transition-colors">
            Add closure
          </button>
        </div>

        {blockedDates.length === 0 ? (
          <div className="text-[#555] text-xs">No special closures set.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {blockedDates
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map(d => (
                <div key={d.date} className="flex items-center gap-1.5 bg-[#141414] border border-[#2a2a2a] rounded-full px-3 py-1.5">
                  <span className="text-[11px] font-bold text-white">
                    {d.reason ? `${d.reason} · ` : ''}{new Date(d.date + 'T12:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                  <button onClick={() => removeClosure(d.date)} className="text-[#555] hover:text-brand-red text-xs font-black ml-1">✕</button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ── HOLIDAY PRESETS ────────────────────────────────────────────────── */}
      <div className="bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-base font-black mb-1">Add national holidays</h2>
        <p className="text-[#888] text-xs mb-5">One click to add all public holidays for 2026.</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '🇪🇸 Spain', key: 'spain' },
            { label: '🇲🇦 Morocco', key: 'morocco' },
            { label: '🇫🇷 France', key: 'france' },
            { label: '🇬🇧 UK', key: 'uk' },
          ].map(({ label, key }) => (
            <button key={key} onClick={() => addHolidays(key)}
              className="border border-[#2a2a2a] text-[#888] hover:border-brand-yellow hover:text-brand-yellow px-5 py-2.5 rounded-full font-bold text-sm transition-colors">
              {label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-[#444] mt-4">
          Adding holidays saves them to Special Closures above. Click &ldquo;Save Shop Hours&rdquo; to persist.
        </p>
      </div>
    </div>
  );
}
