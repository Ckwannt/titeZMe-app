'use client';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShopPhotosTab } from "@/components/ShopPhotosTab";
export default function ShopPhotosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: shop } = useQuery({
    queryKey: ['shop', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'barbershops', user!.uid)); return s.exists() ? s.data() : null; },
    enabled: !!user,
  });
  const mutateShop = () => queryClient.invalidateQueries({ queryKey: ['shop', user?.uid] });
  return <div className="p-6 md:p-8"><ShopPhotosTab shop={shop} mutateShop={mutateShop} /></div>;
}
