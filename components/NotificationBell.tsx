'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { notificationUpdateSchema } from "@/lib/schemas";

export function NotificationBell() {
  const { user, appUser } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Badge count uses the cached unreadCount from the user doc (zero extra Firestore reads).
  // Starts at the value from when the user logged in; resets to 0 locally when dropdown opens.
  const [localUnreadCount, setLocalUnreadCount] = useState(appUser?.unreadCount || 0);

  // Sync if appUser is refreshed or changes (e.g. after login)
  useEffect(() => {
    setLocalUnreadCount(appUser?.unreadCount || 0);
  }, [appUser?.unreadCount]);

  // Lazy onSnapshot: only subscribe while the dropdown is open
  useEffect(() => {
    if (!user || !showDropdown) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );
    const unsub = onSnapshot(q, snap => {
      const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      notifs.sort((a, b) => b.createdAt - a.createdAt);
      setNotifications(notifs);
    });
    return () => unsub();
  }, [user, showDropdown]);

  const handleToggle = () => {
    const opening = !showDropdown;
    setShowDropdown(opening);
    // On open: reset badge immediately (locally + in Firestore)
    if (opening && user && localUnreadCount > 0) {
      setLocalUnreadCount(0);
      updateDoc(doc(db, 'users', user.uid), { unreadCount: 0 }).catch(console.error);
    }
  };

  const handleNotifClick = async (n: any) => {
    // Optimistic: mark read in local state immediately before Firestore responds
    setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
    setShowDropdown(false);
    if (n.linkTo) router.push(n.linkTo);
    // Sync to Firestore in background
    updateDoc(doc(db, 'notifications', n.id), notificationUpdateSchema.parse({ read: true })).catch(e => {
      console.error(e);
      // Revert on failure
      setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: false } : notif));
    });
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center relative hover:bg-[#2a2a2a] transition-colors"
      >
        <span className="text-[15px]">🔔</span>
        {localUnreadCount > 0 && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-brand-red rounded-full flex items-center justify-center text-[9px] font-black pointer-events-none">
            {localUnreadCount}
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
