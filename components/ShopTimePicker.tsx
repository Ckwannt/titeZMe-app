'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getScheduleDocId } from '@/lib/schedule-utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
  past: boolean;
  availableBarberIds: string[];
}

interface DaySlots {
  date: string;
  dayName: string;
  label: string;
  slots: TimeSlot[];
  hasSlots: boolean;
}

export interface ShopTimePickerProps {
  barberIds: string[];
  totalDuration: number;
  bufferMinutes?: number;
  selectedDate?: string;
  selectedTime?: string;
  onSelect: (
    date: string,
    time: string,
    endTime: string,
    availableBarberIds: string[]
  ) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeToMins(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minsToTime(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

function buildWeekDates(weekOffset: number): string[] {
  const base = new Date();
  base.setDate(base.getDate() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${y}-${mo}-${da}`;
  });
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDayLabel(dateStr: string): { dayName: string; label: string } {
  const d = new Date(`${dateStr}T12:00:00`);
  const dayName = `${DAY_NAMES[d.getDay()]} ${d.getDate()}`;
  const label = `${dayName} ${MONTH_SHORT[d.getMonth()]}`;
  return { dayName, label };
}

function getTodayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// ─── Per-barber free check (mirrors SmartTimePicker.generateSlots) ───────────

function isBarberFreeAtSlot(
  slotMins: number,
  totalDuration: number,
  bufferMins: number,
  availableHours: string[],
  bookings: any[],
): boolean {
  if (!availableHours || availableHours.length === 0) return false;

  const totalNeeded = totalDuration + bufferMins;
  const workStart = timeToMins(availableHours[0]);
  const workEnd = timeToMins(availableHours[availableHours.length - 1]) + 60;

  if (slotMins < workStart) return false;
  if (slotMins + totalNeeded > workEnd) return false;

  // Every hour the SERVICE touches must be in availableHours
  const serviceEndMins = slotMins + totalDuration;
  const startHour = Math.floor(slotMins / 60);
  const endHour = Math.floor((serviceEndMins - 1) / 60);
  for (let h = startHour; h <= endHour; h++) {
    if (!availableHours.includes(`${String(h).padStart(2, '0')}:00`)) return false;
  }

  // Booking overlap check (service + buffer vs existing booking + its buffer)
  for (const b of bookings) {
    const bStart = timeToMins(b.startTime);
    const bEnd = bStart + (b.totalDuration || 60) + bufferMins;
    if (slotMins < bEnd && slotMins + totalNeeded > bStart) return false;
  }

  return true;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShopTimePicker({
  barberIds,
  totalDuration,
  bufferMinutes = 10,
  selectedDate,
  selectedTime,
  onSelect,
}: ShopTimePickerProps) {
  const [schedules, setSchedules] = useState<Record<string, any>>({});
  const [bookingsByBarber, setBookingsByBarber] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeDay, setActiveDay] = useState<string>('');

  // ── Subscribe to schedules for every barber ─────────────────────────────────
  useEffect(() => {
    if (!barberIds || barberIds.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const received = new Set<string>();
    const unsubs: Array<() => void> = [];

    barberIds.forEach(bid => {
      const unsub = onSnapshot(
        doc(db, 'schedules', getScheduleDocId(bid)),
        (snap) => {
          setSchedules(prev => ({ ...prev, [bid]: snap.exists() ? snap.data() : null }));
          received.add(bid);
          if (received.size >= barberIds.length) setLoading(false);
        },
        (err) => {
          console.error(`ShopTimePicker schedule error for ${bid}:`, err);
          received.add(bid);
          if (received.size >= barberIds.length) setLoading(false);
        }
      );
      unsubs.push(unsub);
    });

    return () => { unsubs.forEach(u => u()); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barberIds.join('|')]);

  // ── Subscribe to bookings per barber for the visible week ───────────────────
  useEffect(() => {
    if (!barberIds || barberIds.length === 0) return;
    const weekDates = buildWeekDates(weekOffset);
    const startDate = weekDates[0];
    const endDate = weekDates[6];

    const unsubs: Array<() => void> = [];
    barberIds.forEach(bid => {
      const unsub = onSnapshot(
        query(
          collection(db, 'bookings'),
          where('barberId', '==', bid),
          where('date', '>=', startDate),
          where('date', '<=', endDate),
          where('status', 'in', ['pending', 'confirmed'])
        ),
        (snap) => {
          setBookingsByBarber(prev => ({
            ...prev,
            [bid]: snap.docs.map(d => ({ id: d.id, ...d.data() })),
          }));
        },
        (err) => console.error(`ShopTimePicker bookings error for ${bid}:`, err)
      );
      unsubs.push(unsub);
    });

    return () => { unsubs.forEach(u => u()); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barberIds.join('|'), weekOffset]);

  // ── Default active day ──────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedDate) {
      setActiveDay(selectedDate);
      return;
    }
    const todayStr = getTodayStr();
    const dates = buildWeekDates(weekOffset);
    setActiveDay(dates.find(d => d >= todayStr) || dates[0]);
  }, [weekOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effective buffer: use largest schedule buffer if any set, else default ──
  const effectiveBuffer: number = useMemo(() => {
    const vals = barberIds
      .map(bid => schedules[bid]?.cleanupBufferMinutes)
      .filter((v): v is number => typeof v === 'number');
    if (vals.length === 0) return bufferMinutes;
    return Math.max(...vals);
  }, [schedules, barberIds, bufferMinutes]);

  // ── Build week data: merged availability across all barbers ─────────────────
  const weekDates = buildWeekDates(weekOffset);

  const weekData: DaySlots[] = useMemo(() => {
    const todayStr = getTodayStr();
    const curMins = getCurrentMinutes();
    const totalNeeded = totalDuration + effectiveBuffer;

    return weekDates.map(dateStr => {
      const { dayName, label } = formatDayLabel(dateStr);

      // Union of all available hours across barbers determines the slot grid
      const allHoursSet = new Set<string>();
      barberIds.forEach(bid => {
        const hours: string[] = schedules[bid]?.availableSlots?.[dateStr] ?? [];
        hours.forEach(h => allHoursSet.add(h));
      });
      const unionHours = [...allHoursSet].sort();

      if (unionHours.length === 0) {
        return { date: dateStr, dayName, label, slots: [], hasSlots: false };
      }

      const workStart = timeToMins(unionHours[0]);
      const workEnd = timeToMins(unionHours[unionHours.length - 1]) + 60;
      const slots: TimeSlot[] = [];

      for (let m = workStart; m + totalNeeded <= workEnd; m += 30) {
        const slotTime = minsToTime(m);
        const slotEndTime = minsToTime(m + totalDuration);

        const availableBarberIds = barberIds.filter(bid => {
          const sched = schedules[bid];
          const hours: string[] = sched?.availableSlots?.[dateStr] ?? [];
          const bks = bookingsByBarber[bid] ?? [];
          const dayBks = bks.filter((b: any) => b.date === dateStr);
          return isBarberFreeAtSlot(m, totalDuration, effectiveBuffer, hours, dayBks);
        });

        const isPast = dateStr === todayStr && m < curMins + 15;

        slots.push({
          time: slotTime,
          endTime: slotEndTime,
          available: !isPast && availableBarberIds.length > 0,
          past: isPast,
          availableBarberIds,
        });
      }

      return {
        date: dateStr,
        dayName,
        label,
        slots,
        hasSlots: slots.some(s => s.available),
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules, bookingsByBarber, weekOffset, totalDuration, effectiveBuffer, barberIds.join('|')]);

  const activeDayData = weekData.find(d => d.date === activeDay);

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#666', fontSize: 13, fontWeight: 700 }}>
        Loading availability...
      </div>
    );
  }

  // ─── No schedules anywhere ───────────────────────────────────────────────────
  const hasAnySchedule = barberIds.some(bid => {
    const s = schedules[bid];
    return s?.availableSlots && Object.keys(s.availableSlots).length > 0;
  });
  if (!hasAnySchedule) {
    return (
      <div style={{
        padding: '32px 24px',
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏰</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
          No availability set yet
        </div>
        <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>
          This shop hasn&apos;t set its team&apos;s working hours yet.
        </div>
      </div>
    );
  }

  // ─── Main picker ─────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%' }}>

      {/* Duration info pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: '#555',
        fontWeight: 700,
        background: '#0d0d0d',
        border: '1px solid #1e1e1e',
        borderRadius: 99,
        padding: '5px 12px',
        marginBottom: 16,
      }}>
        ⏱ {totalDuration} min service
        {effectiveBuffer > 0 && ` · +${effectiveBuffer} min cleanup`}
        {` = ${totalDuration + effectiveBuffer} min reserved`}
      </div>

      {/* Week navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          disabled={weekOffset <= 0}
          style={{
            background: '#141414',
            border: '1px solid #2a2a2a',
            color: weekOffset <= 0 ? '#333' : '#888',
            borderRadius: 8,
            padding: '6px 14px',
            cursor: weekOffset <= 0 ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontFamily: 'inherit',
            fontWeight: 700,
          }}
        >
          ←
        </button>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#555' }}>
          {weekDates[0].slice(5).replace('-', '/')} — {weekDates[6].slice(5).replace('-', '/')}
        </span>
        <button
          onClick={() => setWeekOffset(w => w + 1)}
          style={{
            background: '#141414',
            border: '1px solid #2a2a2a',
            color: '#888',
            borderRadius: 8,
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 14,
            fontFamily: 'inherit',
            fontWeight: 700,
          }}
        >
          →
        </button>
      </div>

      {/* Day selector strip */}
      <div style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        paddingBottom: 8,
        marginBottom: 20,
        scrollbarWidth: 'none',
      }}>
        {weekData.map(day => {
          const isActive = activeDay === day.date;
          return (
            <button
              key={day.date}
              onClick={() => { if (day.hasSlots) setActiveDay(day.date); }}
              style={{
                flexShrink: 0,
                minWidth: 60,
                padding: '8px 10px',
                borderRadius: 10,
                border: `1px solid ${isActive ? '#E8491D' : day.hasSlots ? '#2a2a2a' : '#1a1a1a'}`,
                background: isActive ? '#1a0a00' : '#141414',
                color: isActive ? '#E8491D' : day.hasSlots ? '#888' : '#2a2a2a',
                cursor: day.hasSlots ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                fontWeight: 800,
                fontSize: 11,
                textAlign: 'center',
                transition: 'all 0.12s',
              }}
            >
              {day.dayName}
              {day.hasSlots && (
                <div style={{ fontSize: 8, color: '#22C55E', marginTop: 2 }}>●</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Time slot grid */}
      {activeDayData ? (
        activeDayData.slots.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '28px 0',
            color: '#444',
            fontSize: 13,
            fontWeight: 700,
          }}>
            No slots available this day.
            <div style={{ fontSize: 11, color: '#333', marginTop: 4 }}>Try another day →</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
          }}>
            {activeDayData.slots.map(slot => {
              const isSelected = selectedDate === activeDay && selectedTime === slot.time;
              const fullyBooked = !slot.past && slot.availableBarberIds.length === 0;

              let bg = '#141414';
              let color = '#444';
              let border = '1px solid #1e1e1e';
              let cursor = 'not-allowed';
              let opacity = 1;

              if (slot.past) {
                bg = '#0a0a0a';
                color = '#222';
                border = '1px solid #111';
                opacity = 0.5;
              } else if (fullyBooked) {
                bg = '#140808';
                color = '#7a2222';
                border = '1px solid #EF444418';
              } else if (isSelected) {
                bg = '#1a0a00';
                color = '#E8491D';
                border = '1px solid #E8491D';
                cursor = 'pointer';
              } else if (slot.available) {
                bg = '#0a1a0a';
                color = '#22C55E';
                border = '1px solid #22C55E28';
                cursor = 'pointer';
              }

              const n = slot.availableBarberIds.length;

              return (
                <button
                  key={slot.time}
                  onClick={() => {
                    if (slot.available) {
                      onSelect(activeDay, slot.time, slot.endTime, slot.availableBarberIds);
                    }
                  }}
                  disabled={!slot.available}
                  style={{
                    background: bg,
                    color,
                    border,
                    borderRadius: 10,
                    padding: '11px 8px',
                    cursor,
                    opacity,
                    fontFamily: 'inherit',
                    textAlign: 'center',
                    transition: 'all 0.1s',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 900 }}>{slot.time}</div>
                  <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>→ {slot.endTime}</div>
                  {slot.available && (
                    <div style={{ fontSize: 9, marginTop: 2, color: '#22C55E', fontWeight: 800 }}>
                      {n} barber{n === 1 ? '' : 's'} free
                    </div>
                  )}
                  {fullyBooked && (
                    <div style={{ fontSize: 9, marginTop: 2, color: '#7a2222' }}>fully booked</div>
                  )}
                </button>
              );
            })}
          </div>
        )
      ) : (
        <div style={{ textAlign: 'center', padding: 24, color: '#444', fontSize: 12 }}>
          Select a day above
        </div>
      )}

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 14,
        marginTop: 16,
        flexWrap: 'wrap',
      }}>
        {[
          { color: '#22C55E', label: 'Available' },
          { color: '#E8491D', label: 'Selected' },
          { color: '#4a2222', label: 'Fully booked' },
          { color: '#2a2a2a', label: 'Past / unavailable' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#555' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
