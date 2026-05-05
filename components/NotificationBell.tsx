'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { notificationUpdateSchema } from "@/lib/schemas";

export function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', user.uid),
      where('read', '==', false)
      // Note: we might need a composite index for where+orderBy, so sorting in client for safety
    );
    const unsub = onSnapshot(q, snap => {
      const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      notifs.sort((a,b) => b.createdAt - a.createdAt);
      setNotifications(notifs);
    });
    return () => unsub();
  }, [user]);

  const handleNotifClick = async (n: any) => {
    try {
      await updateDoc(doc(db, 'notifications', n.id), notificationUpdateSchema.parse({ read: true }));
      setShowDropdown(false);
      if (n.linkTo) router.push(n.linkTo);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center relative hover:bg-[#2a2a2a] transition-colors"
      >
        <span className="text-[15px]">🔔</span>
        {notifications.length > 0 && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-brand-red rounded-full flex items-center justify-center text-[9px] font-black pointer-events-none">
            {notifications.length}
          </div>
        )}
      </button>

      {showDropdown && (
        <div className="absolute top-12 right-0 w-[300px] bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-fadeUp z-50">
          <div className="p-3.5 border-b border-brand-border font-extrabold text-[13px]">
            Notifications
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-brand-text-secondary font-bold">
                You&apos;re all caught up!
              </div>
            ) : (
              notifications.map(n => (
                <button 
                  key={n.id} 
                  onClick={() => handleNotifClick(n)}
                  className="w-full text-left p-3.5 border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors flex flex-col gap-1"
                >
                  <div className="text-[13px] font-bold leading-tight">{n.message}</div>
                  <div className="text-[10px] text-brand-text-secondary font-extrabold">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
