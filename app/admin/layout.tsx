'use client';

import { AdminGuard, useAdminData } from '@/components/AdminGuard';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const adminData = useAdminData();
  const p = adminData?.permissions;

  // Build nav links filtered by permissions
  const allLinks = [
    { label: '⚡ Overview', href: '/admin', always: true },
    { label: '✂️ Barbers', href: '/admin/barbers', perm: p?.canApproveBarbers },
    { label: '🏪 Shops', href: '/admin/shops', perm: p?.canApproveShops },
    { label: '👤 Clients', href: '/admin/clients', perm: p?.canManageUsers },
    { label: '📅 Bookings', href: '/admin/bookings', perm: p?.canManageBookings },
    { label: '⭐ Reviews', href: '/admin/reviews', perm: p?.canManageReviews },
    { label: '🌟 Featured', href: '/admin/featured', perm: p?.canManageFeatured },
    { label: '👥 Team', href: '/admin/team', superAdminOnly: true },
  ];

  const visibleLinks = allLinks.filter(l =>
    l.always || (l.superAdminOnly ? adminData?.isSuperAdmin : l.perm !== false)
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'block',
    padding: '10px 20px',
    fontSize: 13,
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#F5C518' : '#555',
    backgroundColor: isActive ? '#1a1a1a' : 'transparent',
    textDecoration: 'none',
    transition: 'color 0.15s, background-color 0.15s',
    cursor: 'pointer',
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: 220,
      height: '100vh',
      backgroundColor: '#0d0d0d',
      borderRight: '1px solid #141414',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #141414' }}>
        <div style={{ color: '#F5C518', fontWeight: 900, fontSize: 20 }}>
          tite<span style={{ color: '#E8491D' }}>Z</span>Me
        </div>
        <span style={{ fontSize: 10, color: '#555', border: '1px solid #333', borderRadius: 999, padding: '2px 8px', letterSpacing: 1, textTransform: 'uppercase' }}>
          ADMIN
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8, overflowY: 'auto' }}>
        {visibleLinks.map(link => {
          const isActive = link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              style={linkStyle(isActive)}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#888'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#555'; }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer — logged-in user + sign out */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid #141414' }}>
        {adminData && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminData.firstName} {adminData.lastName}
            </div>
            <div style={{ fontSize: 10, color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminData.email}
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          style={{ fontSize: 11, color: '#555', background: 'none', border: '1px solid #222', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', width: '100%' }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh', fontFamily: 'Nunito, sans-serif', color: '#fff' }}>
        {children}
      </div>
    );
  }

  return (
    <AdminGuard>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '28px 32px', minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
        {children}
      </main>
    </AdminGuard>
  );
}
