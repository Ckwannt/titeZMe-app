'use client';

import { useAuth } from "@/lib/auth-context";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";

export default function AvailabilityPage() {
  const { user } = useAuth();
  return (
    <div className="animate-fadeUp p-6 md:p-8">
      <h2 className="text-2xl font-black mb-2">Weekly Schedule</h2>
      <p className="text-brand-text-secondary text-sm mb-6">Drag across the grid to set your working hours. Click a green block to remove it.</p>
      <AvailabilityGrid mode="barber" barberId={user?.uid || ""} />
    </div>
  );
}
