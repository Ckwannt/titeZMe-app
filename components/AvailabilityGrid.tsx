'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { startOfWeek, addDays, format, isBefore, isPast, parseISO, addWeeks, subWeeks, setHours, startOfDay, addMinutes, differenceInMinutes, isSameDay } from 'date-fns';
import { collection, query, where, getDocs, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/lib/toast';
import { scheduleUpdateSchema } from "@/lib/schemas";
import { safeFirestore } from '@/lib/firebase-helpers';

export interface AvailabilityGridProps {
  mode?: 'barber' | 'shop' | 'client';
  barberId?: string;
  totalDuration?: number; // In minutes, used for client mode
  initialData?: {
    weeklyHours?: any;
    blockedDates?: string[];
    bufferMins?: number;
  } | null;
  onSave?: (scheduleData: {
    weeklyHours: any;
    blockedDates: any[];
    bufferMins: number;
  }) => Promise<void>;
  onSlotSelect?: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

export function AvailabilityGrid({ mode = 'barber', barberId = '', totalDuration = 0, onSlotSelect, selectedDate, selectedTime, initialData, onSave }: AvailabilityGridProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [availableSlots, setAvailableSlots] = useState<Record<string, string[]>>({});
  const [bookings, setBookings] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [bufferMinutes, setBufferMinutes] = useState(10);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [recurringBlocked, setRecurringBlocked] = useState<string[]>([]);
  
  const { user } = useAuth();
  const uid = mode === 'barber' && user ? user.uid : barberId;

  // Generate the 7 days of the currently viewed week
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  const hours = Array.from({ length: 24 }).map((_, i) => String(i).padStart(2, '0') + ":00");

  useEffect(() => {
    if (!uid) return;
    
    // Subscribe to Schedule
    const unsubSchedule = onSnapshot(doc(db, 'schedules', `${uid}_shard_0`), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAvailableSlots(data.availableSlots || {});
        setBufferMinutes(data.cleanupBufferMinutes ?? 10);
        // Parse blocked dates — handles both string[] (old) and {date,reason}[] (new)
        const rawBlocked: any[] = data.blockedDates || [];
        setBlockedDates(rawBlocked.map(item => typeof item === 'string' ? item : item.date));
        setRecurringBlocked(data.recurringBlocked || []);
      } else {
        setAvailableSlots({});
        setBlockedDates([]);
        setRecurringBlocked([]);
      }
      if (mode === 'barber') setLoading(false);
    }, (err) => {
      console.error(err);
      if (mode === 'barber') setLoading(false);
    });

    // Subscriptions for Client Mode Data
    let unsubBookings = () => {};
    if (mode === 'client') {
      const q = query(
        collection(db, 'bookings'), 
        where('barberId', '==', uid),
        where('status', 'in', ['pending', 'confirmed'])
      );
      unsubBookings = onSnapshot(q, (snap) => {
        setBookings(snap.docs.map(d => d.data()));
        setLoading(false);
      });
    }

    return () => {
      unsubSchedule();
      unsubBookings();
    };
  }, [uid, mode]);

  const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const handlePrevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const handleToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const toggleSlot = (dateStr: string, hourStr: string, forceAction?: 'add' | 'remove') => {
    if (mode !== 'barber') return;
    
    setAvailableSlots(prev => {
      const dateSlots = prev[dateStr] ? [...prev[dateStr]] : [];
      let nextSlots = [];
      const hasSlot = dateSlots.includes(hourStr);
      
      let action = forceAction;
      if (!action) action = hasSlot ? 'remove' : 'add';

      if (action === 'add' && !hasSlot) {
         nextSlots = [...dateSlots, hourStr];
      } else if (action === 'remove' && hasSlot) {
         nextSlots = dateSlots.filter(h => h !== hourStr);
      } else {
         nextSlots = dateSlots;
      }

      nextSlots.sort();

      return {
        ...prev,
        [dateStr]: nextSlots
      };
    });
  };

  const onMouseDown = (dateStr: string, hourStr: string) => {
    if (mode !== 'barber') return;
    setIsDragging(true);
    const hasSlot = availableSlots[dateStr]?.includes(hourStr);
    const action = hasSlot ? 'remove' : 'add';
    setDragAction(action);
    toggleSlot(dateStr, hourStr, action);
  };

  const onMouseEnter = (dateStr: string, hourStr: string) => {
    if (!isDragging || mode !== 'barber' || !dragAction) return;
    toggleSlot(dateStr, hourStr, dragAction);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setDragAction(null);
  };

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  const saveSchedule = async () => {
    if (!uid) return;
    setSaving(true);
    const result = await safeFirestore(
      () => setDoc(
        doc(db, 'schedules', `${uid}_shard_0`),
        { ...scheduleUpdateSchema.parse({ availableSlots }), cleanupBufferMinutes: bufferMinutes },
        { merge: true }
      ),
      { successMessage: 'Schedule saved!', errorMessage: 'Failed to save schedule.' }
    );
    if (result !== null) setLastSaved(new Date());
    setSaving(false);
  };

  // Standard day slots (09:00–18:00, lunch break at 13:00)
  const STANDARD_SLOTS = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];

  const fillDay = (dateStr: string) => {
    setAvailableSlots(prev => ({
      ...prev,
      [dateStr]: [...new Set([...(prev[dateStr] || []), ...STANDARD_SLOTS])].sort()
    }));
    toast.success(`Today filled with 9:00–18:00 (lunch break at 13:00)`);
  };

  const fillWeekdays = () => {
    const weekdayDates = weekDays.slice(0, 5).map(d => format(d, 'yyyy-MM-dd'));
    setAvailableSlots(prev => {
      const updated = { ...prev };
      weekdayDates.forEach(dateStr => {
        updated[dateStr] = [...new Set([...(prev[dateStr] || []), ...STANDARD_SLOTS])].sort();
      });
      return updated;
    });
    toast.success('Mon–Fri filled with 9:00–18:00');
  };

  const clearWeek = () => {
    if (!confirm('Clear all slots for this week?')) return;
    const weekDateStrs = weekDays.map(d => format(d, 'yyyy-MM-dd'));
    setAvailableSlots(prev => {
      const updated = { ...prev };
      weekDateStrs.forEach(dateStr => { updated[dateStr] = []; });
      return updated;
    });
    toast.success('Week cleared');
  };

  const copyToNextWeek = () => {
    setAvailableSlots(prev => {
      const updated = { ...prev };
      weekDays.forEach(d => {
        const thisDateStr = format(d, 'yyyy-MM-dd');
        const nextDateStr = format(addDays(d, 7), 'yyyy-MM-dd');
        updated[nextDateStr] = [...(prev[thisDateStr] || [])];
      });
      return updated;
    });
    toast.success("This week copied to next week. Don't forget to save!");
  };

  const getClientSlotStatus = (date: Date, hourStr: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const cellTime = setHours(startOfDay(date), parseInt(hourStr));
    
    if (isBefore(cellTime, new Date())) {
       return 'past'; // Faded Grey (past)
    }

    const isAvailableByBarber = availableSlots[dateStr]?.includes(hourStr);
    
    if (!isAvailableByBarber) {
       return 'unavailable'; // Dark Grey
    }

    // Check bookings overlap
    const hourStartMillis = cellTime.getTime();
    const hourEndMillis = hourStartMillis + (60 * 60 * 1000); // 1 hour block
    let overlap = false;
    for (const b of bookings) {
      if (b.date === dateStr) {
         const bsDate = new Date(`${b.date}T${b.startTime}`);
         const bs = bsDate.getTime();
         const be = bs + ((b.totalDuration || 30) * 60 * 1000);
         
         // If booking overlaps with this 1-hour block
         if (bs < hourEndMillis && be > hourStartMillis) {
            overlap = true;
            break;
         }
      }
    }

    if (overlap) {
       return 'booked'; // Red
    }

    return 'available'; // Green
  };

  const handleClientClick = (date: Date, hourStr: string) => {
    if (mode !== 'client') return;
    const dateStr = format(date, 'yyyy-MM-dd');
    const status = getClientSlotStatus(date, hourStr);
    
    if (status !== 'available') return;
    
    // Check if sufficient consecutive time is available
    const startTimeMillis = setHours(startOfDay(date), parseInt(hourStr)).getTime();
    const requiredDurationMillis = totalDuration * 60 * 1000;
    
    // For checking sufficient time, we need to make sure every x mins is free.
    // In our simplified logic grid is 1 hour cells, but bookings can be granular.
    // To be perfectly accurate we'd check free space from startTimeMillis to startTimeMillis + requiredDurationMillis.
    // For now, if they click a green box, we'll allow it and the exact checking happens in `page.tsx` or later if they submit.
    // Actually, we can check here:
    let overlap = false;
    for (const b of bookings) {
      if (b.date === dateStr) {
         const bs = new Date(`${b.date}T${b.startTime}`).getTime();
         const be = bs + ((b.totalDuration || 30) * 60 * 1000);
         if (Math.max(startTimeMillis, bs) < Math.min(startTimeMillis + requiredDurationMillis, be)) {
            overlap = true;
            break;
         }
      }
    }
    
    if (overlap) {
      toast.error("Not enough consecutive time for this service starting here. Try another slot.");
      return;
    }

    if (onSlotSelect) {
      onSlotSelect(dateStr, hourStr);
    }
  };

  if (loading) {
    return <div className="text-brand-text-secondary animate-pulse text-sm">Loading calendar...</div>;
  }

  // ── Summary strip computed values ─────────────────────────────────────────
  const currentWeekSlots = weekDays.reduce((acc, d) =>
    acc + (availableSlots[format(d, 'yyyy-MM-dd')]?.length || 0), 0);

  const workingDaysThisWeek = weekDays.filter(d =>
    (availableSlots[format(d, 'yyyy-MM-dd')]?.length || 0) > 0).length;

  const nextOpenSlot = (() => {
    const now = new Date();
    const nowHour = String(now.getHours()).padStart(2, '0') + ':00';
    const todayStr = format(now, 'yyyy-MM-dd');
    const allSlots: { date: string; time: string }[] = [];
    Object.entries(availableSlots).forEach(([date, slots]) => {
      if (date >= todayStr) {
        (slots as string[]).forEach(time => {
          if (date > todayStr || time > nowHour) allSlots.push({ date, time });
        });
      }
    });
    allSlots.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    return allSlots[0] || null;
  })();

  const nextOpenLabel = nextOpenSlot
    ? `🟢 Next: ${format(parseISO(nextOpenSlot.date), 'EEE')} ${nextOpenSlot.time}`
    : '🔴 No upcoming slots';

  const lastSavedLabel = lastSaved
    ? `Last saved: today at ${lastSaved.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
    : 'Not saved yet';

  return (
    <div className="flex flex-col select-none">

      {/* Addition 1 — Summary strip */}
      {mode === 'barber' && (
        <div className="flex gap-2 flex-wrap mb-3">
          {[
            currentWeekSlots > 0 ? `⏱ ${currentWeekSlots}h available this week` : '⏱ No hours set this week',
            `📅 ${workingDaysThisWeek} day${workingDaysThisWeek !== 1 ? 's' : ''}`,
            nextOpenLabel,
          ].map((label, i) => (
            <span key={i} className="inline-flex items-center gap-[5px] bg-[#111] border border-[#1e1e1e] rounded-full px-3 py-[5px] text-[11px] text-[#888] font-bold">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Addition 2 — Quick fill buttons */}
      {mode === 'barber' && (
        <div className="flex gap-2 flex-wrap mb-[14px]">
          <button
            onClick={() => fillDay(format(new Date(), 'yyyy-MM-dd'))}
            className="bg-[#141414] border border-[#2a2a2a] text-[#888] rounded-full px-[14px] py-[6px] text-[11px] font-bold hover:border-brand-yellow hover:text-brand-yellow transition-colors"
          >
            Fill today
          </button>
          <button
            onClick={fillWeekdays}
            className="bg-[#141414] border border-[#2a2a2a] text-[#888] rounded-full px-[14px] py-[6px] text-[11px] font-bold hover:border-brand-yellow hover:text-brand-yellow transition-colors"
          >
            Fill weekdays
          </button>
          <button
            onClick={copyToNextWeek}
            className="bg-[#141414] border border-[#2a2a2a] text-[#888] rounded-full px-[14px] py-[6px] text-[11px] font-bold hover:border-brand-yellow hover:text-brand-yellow transition-colors"
          >
            Copy to next week →
          </button>
          <button
            onClick={clearWeek}
            className="bg-[#141414] border border-[#EF444433] text-[#666] rounded-full px-[14px] py-[6px] text-[11px] font-bold hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
          >
            Clear week
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black">{format(currentWeekStart, "MMM d")} – {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}</h3>
        <div className="flex gap-2">
          <button onClick={handleToday} className="px-4 py-2 bg-[#1a1a1a] text-[#888] hover:text-white rounded-lg text-xs font-bold transition-colors">Today</button>
          <div className="flex border-[1.5px] border-[#2a2a2a] rounded-lg overflow-hidden shrink-0">
            <button onClick={handlePrevWeek} className="px-3 py-2 bg-[#141414] text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors border-r-[1.5px] border-[#2a2a2a]">←</button>
            <button onClick={handleNextWeek} className="px-3 py-2 bg-[#141414] text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors">→</button>
          </div>
        </div>
      </div>

      <div className="border-[1.5px] border-[#2a2a2a] rounded-xl overflow-hidden bg-[#141414]">
         {/* Header Row */}
         <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b-[1.5px] border-[#2a2a2a] bg-[#0a0a0a]">
            <div className="p-3 border-r-[1.5px] border-[#2a2a2a]" /> {/* Empty Corner */}
            {weekDays.map((d, i) => {
              const dStr = format(d, 'yyyy-MM-dd');
              const dayName = format(d, 'EEE');
              const isDayBlocked = mode === 'barber' && (
                blockedDates.includes(dStr) || recurringBlocked.includes(dayName)
              );
              return (
                <div key={i} className={`p-2 sm:p-3 text-center border-r-[1.5px] border-[#2a2a2a] last:border-r-0 ${isDayBlocked ? 'bg-[#1a0808]/40' : ''}`}>
                  <div className={`text-[11px] font-extrabold uppercase ${isDayBlocked ? 'text-[#EF4444]/80' : 'text-brand-text-secondary'}`}>
                    {isDayBlocked ? '🚫' : dayName}
                  </div>
                  <div className={`text-sm sm:text-base font-black mt-0.5 ${isDayBlocked ? 'text-[#EF4444]/60' : ''}`}>
                    {format(d, 'M/d')}
                  </div>
                  {mode === 'barber' && (
                    <div className={`text-[9px] font-bold mt-0.5 ${(availableSlots[dStr]?.length || 0) > 0 ? 'text-[#22C55E]' : 'text-[#444]'}`}>
                      {(availableSlots[dStr]?.length || 0) > 0 ? `${availableSlots[dStr].length} slots` : 'no slots'}
                    </div>
                  )}
                </div>
              );
            })}
         </div>

         {/* Grid Body */}
         <div className="overflow-y-auto max-h-[60vh] custom-scroll relative">
            {hours.map((hourStr, idx) => (
               <div key={idx} className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
                  {/* Time Label */}
                  <div className="py-3 px-2 border-r-[1.5px] border-b-[1.5px] border-[#2a2a2a] text-[10px] sm:text-xs font-bold text-center text-brand-text-secondary bg-[#0a0a0a] sticky left-0">
                     {hourStr}
                  </div>

                  {/* Day Cells */}
                  {weekDays.map((date, dayIdx) => {
                     const dateStr = format(date, 'yyyy-MM-dd');
                     const isPastCell = isBefore(setHours(startOfDay(date), parseInt(hourStr)), new Date());
                     
                     let cellClasses = "border-b-[1.5px] border-r-[1.5px] border-[#2a2a2a] last:border-r-0 h-10 transition-colors cursor-pointer ";
                     
                     let content = null;

                     if (mode === 'barber') {
                        const isDayBlocked = blockedDates.includes(dateStr) || recurringBlocked.includes(format(date, 'EEE'));
                        if (isDayBlocked) {
                           cellClasses += "bg-[#1a0808] cursor-not-allowed opacity-60";
                           return (
                             <div
                               key={dayIdx}
                               className={cellClasses}
                               onMouseDown={() => toast.error("This day is blocked. Remove the day off first to set availability.")}
                             />
                           );
                        } else if (isPastCell) {
                           cellClasses += "bg-[#0d0d0d] opacity-50 cursor-not-allowed";
                        } else {
                           const isAvailable = availableSlots[dateStr]?.includes(hourStr);
                           if (isAvailable) {
                              cellClasses += "bg-brand-green";
                           } else {
                              cellClasses += "hover:bg-[#1a1a1a]";
                           }
                        }

                        return (
                           <div
                             key={dayIdx}
                             className={cellClasses}
                             onMouseDown={() => !isPastCell && onMouseDown(dateStr, hourStr)}
                             onMouseEnter={() => !isPastCell && onMouseEnter(dateStr, hourStr)}
                           />
                        );
                     } else {
                        // Client Mode
                        const status = getClientSlotStatus(date, hourStr);
                        const isSelected = selectedDate === dateStr && selectedTime === hourStr;

                        if (status === 'past') {
                           cellClasses += "bg-[#0d0d0d] opacity-50 cursor-not-allowed";
                        } else if (status === 'unavailable') {
                           cellClasses += "bg-[#111] cursor-not-allowed";
                        } else if (status === 'booked') {
                           cellClasses += "bg-brand-red cursor-not-allowed";
                           content = <div className="w-full h-full flex items-center justify-center text-[10px] text-white font-bold">Booked</div>;
                        } else if (status === 'available') {
                           if (isSelected) {
                              cellClasses += "bg-brand-yellow text-[#0a0a0a] font-bold";
                              content = <div className="w-full h-full flex items-center justify-center text-[10px]">Selected</div>;
                           } else {
                              cellClasses += "bg-brand-green hover:opacity-80";
                           }
                        }

                        return (
                           <div 
                             key={dayIdx} 
                             className={cellClasses}
                             onClick={() => handleClientClick(date, hourStr)}
                           >
                             {content}
                           </div>
                        );
                     }
                  })}
               </div>
            ))}
         </div>
      </div>

      {mode === 'barber' && (
        <div className="mt-5">
          {/* Addition 6 — Buffer time selector */}
          <div className="mb-4">
            <div className="text-[11px] text-[#888] font-bold mb-2">⏱ Cleanup buffer between cuts</div>
            <div className="flex gap-2 flex-wrap">
              {[0, 5, 10, 15, 20].map(m => (
                <button key={m} onClick={() => setBufferMinutes(m)}
                  className={`px-3 py-[5px] text-[11px] font-extrabold rounded-lg border transition-colors ${
                    bufferMinutes === m
                      ? 'bg-[#1a1500] border-brand-yellow text-brand-yellow'
                      : 'bg-[#141414] border-[#2a2a2a] text-[#666] hover:border-[#444] hover:text-[#888]'
                  }`}>
                  {m} min
                </button>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={saveSchedule}
              disabled={saving}
              className="bg-brand-yellow text-[#0a0a0a] px-8 py-3.5 rounded-full font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Schedule"}
            </button>
          </div>

          {/* Addition 3 — Last saved timestamp */}
          <div className="text-[10px] text-[#444] italic text-center mt-2">
            {lastSavedLabel}
          </div>
        </div>
      )}
    </div>
  );
}
