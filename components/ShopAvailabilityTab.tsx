'use client';

import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc, collection, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AvailabilityGrid } from './AvailabilityGrid';
import { toast } from 'react-hot-toast';
import { scheduleSchema } from "@/lib/schemas";

interface ShopAvailabilityTabProps {
  schedule: any;
  mutateSchedule: () => void;
}

export function ShopAvailabilityTab({ schedule, mutateSchedule }: ShopAvailabilityTabProps) {
  const { user } = useAuth();

  const handleSave = async (scheduleData: { weeklyHours: any; blockedDates: any[]; bufferMins: number }) => {
    if(!user) return;
    const loadingToast = toast.loading("Saving schedule...");
    try {
      await setDoc(doc(db, 'schedules', `${user.uid}_shard_0`), scheduleSchema.parse({
              ownerId: user.uid,
              weeklyHours: scheduleData.weeklyHours,
              blockedDates: scheduleData.blockedDates,
              bufferMins: scheduleData.bufferMins
            }));
      mutateSchedule();
      toast.success("Shop hours saved!", { id: loadingToast });
    } catch(e) {
      console.error(e);
      toast.error("Failed to save schedule.", { id: loadingToast });
    }
  };

  return (
    <div className="animate-fadeUp max-w-4xl relative pb-20">
      <h1 className="text-2xl font-black mb-2">Availability ⏰</h1>
      <p className="text-brand-text-secondary text-sm mb-8">Set your shop&apos;s working hours and closed days. This applies to the shop overall.</p>
      
      <AvailabilityGrid initialData={schedule} onSave={handleSave} />
    </div>
  );
}
