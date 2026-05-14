'use client';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShopAvailabilityTab } from "@/components/ShopAvailabilityTab";
export default function ShopAvailabilityPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: schedule } = useQuery({
    queryKey: ['shopSchedule', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'schedules', `${user!.uid}_shard_0`)); return s.exists() ? s.data() : null; },
    enabled: !!user,
  });
  const mutateSchedule = () => queryClient.invalidateQueries({ queryKey: ['shopSchedule', user?.uid] });
  return <div className="p-6 md:p-8"><ShopAvailabilityTab schedule={schedule} mutateSchedule={mutateSchedule} /></div>;
}
