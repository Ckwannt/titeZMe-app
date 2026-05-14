'use client';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShopServicesTab } from "@/components/ShopServicesTab";
export default function ShopServicesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: shop } = useQuery({
    queryKey: ['shop', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'barbershops', user!.uid)); return s.exists() ? s.data() : null; },
    enabled: !!user,
  });
  const { data: services = [] } = useQuery({
    queryKey: ['shopServices', user?.uid],
    queryFn: async () => { const q = query(collection(db, 'services'), where('providerId', '==', user!.uid), where('providerType', '==', 'shop')); const snap = await getDocs(q); return snap.docs.map(d => ({ id: d.id, ...d.data() } as any)); },
    enabled: !!user,
  });
  const mutateShop = () => queryClient.invalidateQueries({ queryKey: ['shop', user?.uid] });
  const mutateServices = () => queryClient.invalidateQueries({ queryKey: ['shopServices', user?.uid] });
  return <div className="p-6 md:p-8"><ShopServicesTab services={services} mutateServices={mutateServices} shop={shop} mutateShop={mutateShop} /></div>;
}
