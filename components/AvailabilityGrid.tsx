'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { startOfWeek, addDays, format, isBefore, isPast, parseISO, addWeeks, subWeeks, setHours, startOfDay, addMinutes, differenceInMinutes, isSameDay } from 'date-fns';
import { collection, query, where, getDocs, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

export interface AvailabilityGridProps {
  mode: 'barber' | 'client';
  barberId: string;
  totalDuration?: number; // In minutes, used for client mode
  onSlotSelect?: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

export function AvailabilityGrid({ mode, barberId, totalDuration = 0, onSlotSelect, selectedDate, selectedTime }: AvailabilityGridProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [availableSlots, setAvailableSlots] = useState<Record<string, string[]>>({});
  const [bookings, setBookings] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { user } = useAuth();
  const uid = mode === 'barber' && user ? user.uid : barberId;

  // Generate the 7 days of the currently viewed week
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  const hours = Array.from({ length: 24 }).map((_, i) => String(i).padStart(2, '0') + ":00");

  useEffect(() => {
    if (!uid) return;
    
    // Subscribe to Schedule
    const unsubSchedule = onSnapshot(doc(db, 'schedules', uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().availableSlots) {
        setAvailableSlots(docSnap.data().availableSlots);
      } else {
        setAvailableSlots({});
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
    try {
      await setDoc(doc(db, 'schedules', uid), { availableSlots }, { merge: true });
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
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
      alert("Not enough consecutive time for this service starting here. Try another slot.");
      return;
    }

    if (onSlotSelect) {
      onSlotSelect(dateStr, hourStr);
    }
  };

  if (loading) {
    return <div className="text-brand-text-secondary animate-pulse text-sm">Loading calendar...</div>;
  }

  return (
    <div className="flex flex-col select-none">
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
            {weekDays.map((d, i) => (
              <div key={i} className="p-2 sm:p-3 text-center border-r-[1.5px] border-[#2a2a2a] last:border-r-0">
                 <div className="text-[11px] font-extrabold text-brand-text-secondary uppercase">{format(d, 'EEE')}</div>
                 <div className="text-sm sm:text-base font-black mt-0.5">{format(d, 'M/d')}</div>
              </div>
            ))}
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
                        if (isPastCell) {
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
         <div className="mt-5 flex justify-end">
            <button 
               onClick={saveSchedule} 
               disabled={saving}
               className="bg-brand-yellow text-[#0a0a0a] px-8 py-3.5 rounded-full font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
            >
               {saving ? "Saving..." : "Save Schedule"}
            </button>
         </div>
      )}
    </div>
  );
}
