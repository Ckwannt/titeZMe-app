'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AdminPermissions } from '@/lib/types';

export interface AdminData {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  firstName: string;
  lastName: string;
  email: string;
  permissions: AdminPermissions;
}

const DEFAULT_PERMISSIONS: AdminPermissions = {
  canApproveBarbers: false,
  canApproveShops: false,
  canManageReviews: false,
  canManageBookings: false,
  canManageUsers: false,
  canManageFeatured: false,
  canCreateAdmins: false,
};

export const AdminContext = createContext<AdminData | null>(null);

export function useAdminData(): AdminData | null {
  return useContext(AdminContext);
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/admin/login');
      setChecking(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));

        if (!snap.exists()) {
          router.replace('/admin/login');
          setChecking(false);
          return;
        }

        const data = snap.data();
        const isAdminUser = data?.isAdmin === true || data?.role === 'admin';

        if (!isAdminUser) {
          router.replace('/');
          setChecking(false);
          return;
        }

        setAdminData({
          isAdmin: true,
          isSuperAdmin: data?.isSuperAdmin === true,
          firstName: data?.firstName || 'Admin',
          lastName: data?.lastName || '',
          email: data?.email || user.email || '',
          permissions: {
            ...DEFAULT_PERMISSIONS,
            ...(data?.permissions || {}),
          },
        });
      } catch (err) {
        console.error('Admin check failed:', err);
        router.replace('/admin/login');
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid #1e1e1e',
          borderTop: '3px solid #F5C518',
          borderRadius: '50%',
          animation: 'ag-spin 0.8s linear infinite',
        }} />
        <div style={{ fontSize: 11, color: '#555' }}>Verifying admin access...</div>
        <style>{`@keyframes ag-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user || !adminData) return null;

  return (
    <AdminContext.Provider value={adminData}>
      {children}
    </AdminContext.Provider>
  );
}
