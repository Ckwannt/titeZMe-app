'use client';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShopSettingsTab } from "@/components/ShopSettingsTab";
export default function ShopSettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: shop } = useQuery({
    queryKey: ['shop', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'barbershops', user!.uid)); return s.exists() ? s.data() : null; },
    enabled: !!user,
  });
  const mutateShop = () => queryClient.invalidateQueries({ queryKey: ['shop', user?.uid] });
  return <ShopSettingsTab shop={shop} mutateShop={mutateShop} />;
}
