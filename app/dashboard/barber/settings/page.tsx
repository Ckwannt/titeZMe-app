'use client';

import { useAuth } from "@/lib/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarberSettingsTab } from "@/components/BarberSettingsTab";

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'barberProfiles', user!.uid)); return s.exists() ? s.data() : null; },
    enabled: !!user,
  });
  const mutateProfile = () => queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
  return <BarberSettingsTab profile={profile} mutateProfile={mutateProfile} />;
}
