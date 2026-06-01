'use client';

import { useAuth } from "@/lib/auth-context";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { useLang } from "@/lib/i18n/LangContext";

export default function AvailabilityPage() {
  const { user } = useAuth();
  const { t } = useLang();
  return (
    <div className="animate-fadeUp p-6 md:p-8">
      <h2 className="text-2xl font-black mb-2">{t('barberLayout.weeklySchedule')}</h2>
      <p className="text-brand-text-secondary text-sm mb-6">{t('barberLayout.weeklyScheduleDesc')}</p>
      <AvailabilityGrid mode="barber" barberId={user?.uid || ""} />
    </div>
  );
}
