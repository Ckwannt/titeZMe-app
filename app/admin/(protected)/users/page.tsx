'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserStats {
  total: number;
  clients: number;
  barbers: number;
}

export default function AdminUsersPage() {
  const [stats, setStats] = useState<UserStats>({ total: 0, clients: 0, barbers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        let clients = 0;
        let barbers = 0;
        snap.docs.forEach((d) => {
          const role = d.data().role;
          if (role === 'client') clients++;
          else if (role === 'professional') barbers++;
        });
        setStats({ total: snap.size, clients, barbers });
        setLoading(false);
      },
      (err) => {
        console.error('Users counter listener error:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return (
    <div style={{ maxWidth: 1100 }}>
      <style>{`
        @keyframes tzmPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .tzm-live-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #22C55E;
          box-shadow: 0 0 8px #22C55E;
          animation: tzmPulse 1.6s ease-in-out infinite;
        }
        .tzm-total-number {
          font-size: 48px;
        }
        @media (min-width: 768px) {
          .tzm-total-number {
            font-size: 80px;
          }
        }
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
          Users
        </h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
          Every member who joined titeZMe
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#666', fontSize: 14, padding: 40, textAlign: 'center' }}>
          Loading…
        </div>
      ) : (
        <>
          <div
            className="bg-[#111] border border-[#1e1e1e] rounded-2xl"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            <div
              className="tzm-total-number"
              style={{
                fontWeight: 900,
                color: '#F5C518',
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              {stats.total.toLocaleString()}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 14,
                color: '#666',
                fontWeight: 700,
              }}
            >
              <span className="tzm-live-dot" aria-hidden="true" />
              <span>Total Members</span>
            </div>
            <div style={{ fontSize: 11, color: '#444', marginTop: 6 }}>
              Updating live
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
            }}
          >
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
              <div style={{ fontSize: 20, marginBottom: 8 }}>👤</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: '#F5C518',
                  lineHeight: 1,
                }}
              >
                {stats.clients.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
                Clients
              </div>
            </div>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
              <div style={{ fontSize: 20, marginBottom: 8 }}>✂️</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: '#E8491D',
                  lineHeight: 1,
                }}
              >
                {stats.barbers.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
                Barbers
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
