'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { getLocalDateString } from '@/lib/schedule-utils';

interface Stats {
  pendingBarbers: number;
  liveBarbers: number;
  activeShops: number;
  totalClients: number;
  bookingsToday: number;
  bookingsMonth: number;
  bookingsTotal: number;
  suspendedAccounts: number;
}

interface ActivityItem {
  id: string;
  clientId?: string;
  clientName?: string;
  barberId?: string;
  barberName?: string;
  date?: string;
  status?: string;
  createdAt?: number;
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === 'confirmed' || s === 'completed')
    return (
      <span className="bg-[#0f2010] text-[#22C55E] px-2.5 py-1 rounded-full text-[11px] font-black">
        {status}
      </span>
    );
  if (s === 'pending')
    return (
      <span className="bg-[#1a1500] text-[#F5C518] px-2.5 py-1 rounded-full text-[11px] font-black">
        {status}
      </span>
    );
  if (s === 'cancelled' || s === 'rejected')
    return (
      <span className="bg-[#1a0808] text-[#EF4444] px-2.5 py-1 rounded-full text-[11px] font-black">
        {status}
      </span>
    );
  return (
    <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">
      {status}
    </span>
  );
}

function formatDateNice(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    pendingBarbers: 0,
    liveBarbers: 0,
    activeShops: 0,
    totalClients: 0,
    bookingsToday: 0,
    bookingsMonth: 0,
    bookingsTotal: 0,
    suspendedAccounts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const todayStr = getLocalDateString();
        const monthStr = todayStr.slice(0, 7); // YYYY-MM

        const [
          pendingSnap,
          liveSnap,
          shopsSnap,
          clientsSnap,
          todaySnap,
          monthSnap,
          suspendedSnap,
          totalSnap,
          activitySnap,
        ] = await Promise.all([
          getDocs(
            query(
              collection(db, 'barberProfiles'),
              where('approvalStatus', '==', 'pending')
            )
          ),
          getDocs(
            query(
              collection(db, 'barberProfiles'),
              where('isLive', '==', true)
            )
          ),
          getDocs(
            query(
              collection(db, 'barbershops'),
              where('status', '==', 'active')
            )
          ),
          getDocs(
            query(collection(db, 'users'), where('role', '==', 'client'))
          ),
          getDocs(
            query(collection(db, 'bookings'), where('date', '==', todayStr))
          ),
          getDocs(
            query(
              collection(db, 'bookings'),
              where('date', '>=', monthStr),
              where('date', '<', monthStr + '-99')
            )
          ),
          getDocs(
            query(
              collection(db, 'barberProfiles'),
              where('approvalStatus', '==', 'suspended')
            )
          ),
          getDocs(collection(db, 'bookings')),
          getDocs(
            query(
              collection(db, 'bookings'),
              orderBy('createdAt', 'desc'),
              limit(8)
            )
          ),
        ]);

        setStats({
          pendingBarbers: pendingSnap.size,
          liveBarbers: liveSnap.size,
          activeShops: shopsSnap.size,
          totalClients: clientsSnap.size,
          bookingsToday: todaySnap.size,
          bookingsMonth: monthSnap.size,
          bookingsTotal: totalSnap.size,
          suspendedAccounts: suspendedSnap.size,
        });

        const activity: ActivityItem[] = activitySnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ActivityItem, 'id'>),
        }));
        setRecentActivity(activity);
      } catch (err) {
        console.error('Admin overview fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const todayStr = getLocalDateString();

  const statCards = [
    {
      label: 'Pending Approval',
      value: stats.pendingBarbers,
      color: stats.pendingBarbers > 0 ? '#E8491D' : '#555',
      emoji: '⏳',
    },
    {
      label: 'Live Barbers',
      value: stats.liveBarbers,
      color: '#22C55E',
      emoji: '✂️',
    },
    {
      label: 'Active Shops',
      value: stats.activeShops,
      color: '#60a5fa',
      emoji: '🏪',
    },
    {
      label: 'Total Clients',
      value: stats.totalClients,
      color: '#fff',
      emoji: '👤',
    },
    {
      label: 'Bookings Today',
      value: stats.bookingsToday,
      color: '#F5C518',
      emoji: '📅',
    },
    {
      label: 'This Month',
      value: stats.bookingsMonth,
      color: '#F5C518',
      emoji: '📊',
    },
    {
      label: 'All Time',
      value: stats.bookingsTotal,
      color: '#fff',
      emoji: '🔢',
    },
    {
      label: 'Suspended',
      value: stats.suspendedAccounts,
      color: stats.suspendedAccounts > 0 ? '#EF4444' : '#555',
      emoji: '🚫',
    },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
          Overview
        </h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
          {formatDateNice(todayStr)}
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#555', fontSize: 14 }}>Loading stats…</div>
      ) : (
        <>
          {/* Stat cards — 2 rows of 4 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              marginBottom: 28,
            }}
          >
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5"
              >
                <div style={{ fontSize: 20, marginBottom: 8 }}>{card.emoji}</div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    color: card.color,
                    lineHeight: 1,
                  }}
                >
                  {card.value.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          {(stats.pendingBarbers > 0 || stats.suspendedAccounts > 0) && (
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 12,
                }}
              >
                Needs attention
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stats.pendingBarbers > 0 && (
                  <div
                    style={{
                      background: '#1a1200',
                      border: '1px solid #F5C51830',
                      borderRadius: 12,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>⏳</span>
                      <span style={{ fontSize: 13, color: '#F5C518', fontWeight: 700 }}>
                        {stats.pendingBarbers} barber
                        {stats.pendingBarbers !== 1 ? 's' : ''} waiting for approval
                      </span>
                    </div>
                    <Link
                      href="/admin/barbers?tab=pending"
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#F5C518',
                        textDecoration: 'none',
                      }}
                    >
                      Review →
                    </Link>
                  </div>
                )}
                {stats.suspendedAccounts > 0 && (
                  <div
                    style={{
                      background: '#1a0808',
                      border: '1px solid #EF444430',
                      borderRadius: 12,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>🚫</span>
                      <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 700 }}>
                        {stats.suspendedAccounts} suspended account
                        {stats.suspendedAccounts !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <Link
                      href="/admin/barbers?tab=suspended"
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#EF4444',
                        textDecoration: 'none',
                      }}
                    >
                      Review →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <h2
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: '#fff',
                marginBottom: 14,
              }}
            >
              Recent activity
            </h2>
            {recentActivity.length === 0 ? (
              <p style={{ fontSize: 13, color: '#555' }}>No bookings yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#0d0d0d',
                      borderRadius: 10,
                      border: '1px solid #1a1a1a',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>
                          Client
                        </div>
                        <div style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>
                          {item.clientName || item.clientId || '—'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>
                          Barber
                        </div>
                        <div style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>
                          {item.barberName || item.barberId || '—'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>
                          Date
                        </div>
                        <div style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>
                          {item.date || '—'}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
