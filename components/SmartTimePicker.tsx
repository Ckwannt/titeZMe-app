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
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
  booked: boolean;
  past: boolean;
}

interface DaySlots {
  date: string;
  dayName: string;  // e.g. "Mon 18"
  label: string;    // e.g. "Mon 18 May"
  slots: TimeSlot[];
  hasSlots: boolean;
}

export interface SmartTimePickerProps {
  barberId: string;
  /** Total service duration in minutes */
  totalDuration: number;
  /** Override cleanup buffer — fetched from schedule if not provided */
  bufferMinutes?: number;
  selectedDate?: string;
  selectedTime?: string;
  onSelect: (date: string, time: string, endTime: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeToMins(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minsToTime(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** Return YYYY-MM-DD strings for 7 days starting from today + weekOffset*7 days. */
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
  // Use T12:00:00 to avoid DST-driven date shifts
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

// ─── Slot generation ─────────────────────────────────────────────────────────

function generateSlots(
  dateStr: string,
  availableHours: string[],
  bookings: any[],
  totalDuration: number,
  bufferMins: number,
): TimeSlot[] {
  if (!availableHours || availableHours.length === 0) return [];

  const totalNeeded = totalDuration + bufferMins;
  const workStart = timeToMins(availableHours[0]);
  const workEnd = timeToMins(availableHours[availableHours.length - 1]) + 60;

  const todayStr = getTodayStr();
  const curMins = getCurrentMinutes();

  const slots: TimeSlot[] = [];

  for (let m = workStart; m + totalNeeded <= workEnd; m += 30) {
    // ── Verify every hour touched by the SERVICE (not buffer) is scheduled ──
    const serviceEndMins = m + totalDuration;
    const startHour = Math.floor(m / 60);
    const endHour = Math.floor((serviceEndMins - 1) / 60);
    let scheduleCoversSlot = true;
    for (let h = startHour; h <= endHour; h++) {
      if (!availableHours.includes(`${String(h).padStart(2, '0')}:00`)) {
        scheduleCoversSlot = false;
        break;
      }
    }
    if (!scheduleCoversSlot) continue;

    const slotTime = minsToTime(m);
    const slotEndTime = minsToTime(m + totalDuration);

    // ── Check booking overlaps (service + buffer vs existing booking + its buffer) ──
    const isBooked = bookings.some(b => {
      const bStart = timeToMins(b.startTime);
      const bEnd = bStart + (b.totalDuration || 60) + bufferMins;
      return m < bEnd && m + totalNeeded > bStart;
    });

    // ── Past: give 15-min leeway so slots "right now" are still bookable ──
    const isPast = dateStr === todayStr && m < curMins + 15;

    slots.push({ time: slotTime, endTime: slotEndTime, available: !isBooked && !isPast, booked: isBooked, past: isPast });
  }

  return slots;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SmartTimePicker({
  barberId,
  totalDuration,
  bufferMinutes = 10,
  selectedDate,
  selectedTime,
  onSelect,
}: SmartTimePickerProps) {
  const [schedule, setSchedule] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeDay, setActiveDay] = useState<string>('');

  // Effective buffer: use schedule's cleanupBufferMinutes if available
  const effectiveBuffer: number =
    schedule?.cleanupBufferMinutes !== undefined
      ? (schedule.cleanupBufferMinutes as number)
      : bufferMinutes;

  // ── Subscribe to schedule ────────────────────────────────────────────────────
  useEffect(() => {
    if (!barberId) return;
    const unsub = onSnapshot(
      doc(db, 'schedules', getScheduleDocId(barberId)),
      (snap) => {
        setSchedule(snap.exists() ? snap.data() : null);
        setLoading(false);
      },
      (err) => {
        console.error('SmartTimePicker schedule error:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [barberId]);

  // ── Subscribe to bookings for the current week ───────────────────────────────
  useEffect(() => {
    if (!barberId) return;
    const weekDates = buildWeekDates(weekOffset);
    const startDate = weekDates[0];
    const endDate = weekDates[6];

    const unsub = onSnapshot(
      query(
        collection(db, 'bookings'),
        where('barberId', '==', barberId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        where('status', 'in', ['pending', 'confirmed'])
      ),
      (snap) => setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error('SmartTimePicker bookings error:', err)
    );
    return () => unsub();
  }, [barberId, weekOffset]);

  // ── Default active day ───────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedDate) {
      setActiveDay(selectedDate);
      return;
    }
    const todayStr = getTodayStr();
    const dates = buildWeekDates(weekOffset);
    setActiveDay(dates.find(d => d >= todayStr) || dates[0]);
  }, [weekOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Build week data ──────────────────────────────────────────────────────────
  const weekDates = buildWeekDates(weekOffset);

  const weekData: DaySlots[] = useMemo(() => {
    return weekDates.map(dateStr => {
      const { dayName, label } = formatDayLabel(dateStr);
      const availableHours: string[] = schedule?.availableSlots?.[dateStr] || [];
      const dayBookings = bookings.filter(b => b.date === dateStr);
      const slots = generateSlots(dateStr, availableHours, dayBookings, totalDuration, effectiveBuffer);
      return {
        date: dateStr,
        dayName,
        label,
        slots,
        hasSlots: slots.some(s => s.available),
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, bookings, weekOffset, totalDuration, effectiveBuffer]);

  const activeDayData = weekData.find(d => d.date === activeDay);

  // ─── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{
          width: 28,
          height: 28,
          border: '2px solid #1e1e1e',
          borderTopColor: '#F5C518',
          borderRadius: '50%',
          margin: '0 auto 12px',
          animation: 'stp-spin 0.7s linear infinite',
        }} />
        <div style={{ fontSize: 12, color: '#555', fontWeight: 700 }}>Fetching availability…</div>
        <style>{`@keyframes stp-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── No schedule ──────────────────────────────────────────────────────────────
  if (!schedule?.availableSlots || Object.keys(schedule.availableSlots).length === 0) {
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
        <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 20 }}>
          This barber hasn&apos;t set their working hours yet.<br />
          Check back soon or choose another barber.
        </div>
        <Link
          href="/barbers"
          style={{
            display: 'inline-block',
            color: '#F5C518',
            fontSize: 13,
            fontWeight: 800,
            textDecoration: 'none',
            border: '1px solid #F5C51840',
            borderRadius: 99,
            padding: '8px 20px',
          }}
        >
          ← Find another barber
        </Link>
      </div>
    );
  }

  // ─── Main picker ──────────────────────────────────────────────────────────────
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
                border: `1px solid ${isActive ? '#F5C518' : day.hasSlots ? '#2a2a2a' : '#1a1a1a'}`,
                background: isActive ? '#1a1500' : '#141414',
                color: isActive ? '#F5C518' : day.hasSlots ? '#888' : '#2a2a2a',
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
              } else if (slot.booked) {
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

              return (
                <button
                  key={slot.time}
                  onClick={() => { if (slot.available) onSelect(activeDay, slot.time, slot.endTime); }}
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
                  {slot.booked && (
                    <div style={{ fontSize: 9, marginTop: 2, color: '#7a2222' }}>booked</div>
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
          { color: '#4a2222', label: 'Booked' },
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
