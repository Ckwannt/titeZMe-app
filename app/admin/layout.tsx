'use client';

import { AdminGuard } from '@/components/AdminGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: '⚡ Overview', href: '/admin' },
  { label: '✂️ Barbers', href: '/admin/barbers' },
  { label: '🏪 Shops', href: '/admin/shops' },
  { label: '👤 Clients', href: '/admin/clients' },
  { label: '📅 Bookings', href: '/admin/bookings' },
  { label: '⭐ Reviews', href: '/admin/reviews' },
  { label: '🌟 Featured', href: '/admin/featured' },
];

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 220,
        height: '100vh',
        backgroundColor: '#0d0d0d',
        borderRight: '1px solid #141414',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 24px 20px', borderBottom: '1px solid #141414' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#F5C518', fontWeight: 900, fontSize: 20 }}>
            tite<span style={{ color: '#E8491D' }}>Z</span>Me
          </span>
        </div>
        <div style={{ marginTop: 6 }}>
          <span
            style={{
              fontSize: 10,
              color: '#555',
              border: '1px solid #333',
              borderRadius: 999,
              padding: '2px 8px',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            ADMIN
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {navLinks.map((link) => {
          const isActive =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 500,
                color: isActive ? '#F5C518' : '#555',
                backgroundColor: isActive ? '#1a1a1a' : 'transparent',
                textDecoration: 'none',
                transition: 'color 0.15s, background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#888';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#555';
                }
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #141414' }}>
        <span style={{ fontSize: 10, color: '#333' }}>Admin panel · titeZMe</span>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminSidebar />
      <main
        style={{
          marginLeft: 220,
          padding: '28px 32px',
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
        }}
      >
        {children}
      </main>
    </AdminGuard>
  );
}
