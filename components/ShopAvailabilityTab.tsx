'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc, collection, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AvailabilityGrid } from './AvailabilityGrid';

interface ShopAvailabilityTabProps {
  schedule: any;
  mutateSchedule: () => void;
}

export function ShopAvailabilityTab({ schedule, mutateSchedule }: ShopAvailabilityTabProps) {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async (scheduleData: { weeklyHours: any; blockedDates: any[]; bufferMins: number }) => {
    if(!user) return;
    try {
      await setDoc(doc(db, 'schedules', user.uid), {
        ownerId: user.uid,
        weeklyHours: scheduleData.weeklyHours,
        blockedDates: scheduleData.blockedDates,
        bufferMins: scheduleData.bufferMins
      });
      mutateSchedule();
      setSuccessMsg("Shop hours saved!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch(e) {
      console.error(e);
      alert("Failed to save schedule.");
    }
  };

  return (
    <div className="animate-fadeUp max-w-4xl relative pb-20">
      <h1 className="text-2xl font-black mb-2">Availability ⏰</h1>
      <p className="text-brand-text-secondary text-sm mb-8">Set your shop&apos;s working hours and closed days. This applies to the shop overall.</p>
      
      {successMsg && (
        <div className="bg-[#0f2010] border border-[#1b3b1c] text-brand-green rounded-xl px-4 py-3 text-sm font-bold mb-6">
          {successMsg}
        </div>
      )}

      <AvailabilityGrid initialData={schedule} onSave={handleSave} />
    </div>
  );
}
