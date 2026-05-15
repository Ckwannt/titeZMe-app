'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useAdminData } from '@/components/AdminGuard';
import { toast } from '@/lib/toast';
import type { AdminPermissions } from '@/lib/types';

const DEFAULT_PERMS: AdminPermissions = {
  canApproveBarbers: true,
  canApproveShops: true,
  canManageReviews: true,
  canManageBookings: true,
  canManageUsers: true,
  canManageFeatured: true,
  canCreateAdmins: false,
};

const PERM_LABELS: { key: keyof AdminPermissions; label: string; danger?: boolean }[] = [
  { key: 'canApproveBarbers', label: 'Approve barbers' },
  { key: 'canApproveShops', label: 'Approve shops' },
  { key: 'canManageReviews', label: 'Manage reviews' },
  { key: 'canManageBookings', label: 'Manage bookings' },
  { key: 'canManageUsers', label: 'Manage users' },
  { key: 'canManageFeatured', label: 'Manage featured' },
  { key: 'canCreateAdmins', label: 'Create admins', danger: true },
];

export default function AdminTeamPage() {
  const { user } = useAuth();
  const adminData = useAdminData();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [perms, setPerms] = useState<AdminPermissions>({ ...DEFAULT_PERMS });
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null);

  const isSuperAdmin = adminData?.isSuperAdmin === true;

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'adminUsers'));
      setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleRemove = async (adminId: string, adminName: string) => {
    if (adminId === user?.uid) {
      toast.error("You can't remove yourself.");
      return;
    }
    if (!confirm(`Remove admin access for ${adminName}? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'adminUsers', adminId));
      await setDoc(doc(db, 'users', adminId), { isAdmin: false, role: 'client' }, { merge: true });
      toast.success(`${adminName} removed from admin team.`);
      fetchAdmins();
    } catch (e) {
      toast.error('Failed to remove admin.');
      console.error(e);
    }
  };

  const handleCreate = async () => {
    if (!firstName || !lastName || !email || !tempPassword) {
      toast.error('Fill in all fields.');
      return;
    }
    if (tempPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setCreating(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, tempPassword);
      const uid = credential.user.uid;
      const now = Date.now();

      const adminDoc = {
        uid,
        email,
        role: 'admin',
        isAdmin: true,
        isSuperAdmin: false,
        firstName,
        lastName,
        createdAt: now,
        isOnboarded: true,
        permissions: perms,
      };

      await Promise.all([
        setDoc(doc(db, 'users', uid), adminDoc),
        setDoc(doc(db, 'adminUsers', uid), adminDoc),
      ]);

      setCreatedCreds({ email, password: tempPassword });
      setFirstName(''); setLastName(''); setEmail(''); setTempPassword('');
      setPerms({ ...DEFAULT_PERMS });
      setShowForm(false);
      fetchAdmins();
      toast.success(`Admin account created for ${firstName}!`);
    } catch (e: any) {
      const msg = e?.code === 'auth/email-already-in-use'
        ? 'That email is already in use.'
        : e?.message || 'Failed to create admin.';
      toast.error(msg);
      console.error(e);
    }
    setCreating(false);
  };

  const togglePerm = (key: keyof AdminPermissions) => {
    setPerms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (!isSuperAdmin) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Access denied</div>
        <div style={{ color: '#666', fontSize: 13 }}>You don&apos;t have permission to manage admin accounts.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, marginBottom: 4 }}>Admin Team</h1>
        <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Manage who has admin access to titeZMe.</p>
      </div>

      {/* Created credentials notice */}
      {createdCreds && (
        <div style={{ background: '#0f2010', border: '1px solid #22C55E33', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ fontWeight: 900, color: '#22C55E', marginBottom: 8 }}>✓ Admin account created!</div>
          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>Share these credentials securely:</div>
          <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#fff', background: '#141414', borderRadius: 8, padding: '8px 12px' }}>
            Email: {createdCreds.email}<br />
            Password: {createdCreds.password}
          </div>
          <button onClick={() => setCreatedCreds(null)} style={{ marginTop: 10, fontSize: 11, color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

      {/* Current admins */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 16 }}>Current Admins ({admins.length})</div>
        {loading ? (
          <div style={{ color: '#555', fontSize: 13 }}>Loading...</div>
        ) : admins.length === 0 ? (
          <div style={{ color: '#555', fontSize: 13 }}>No admin accounts found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {admins.map(a => (
              <div key={a.id} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#F5C518', flexShrink: 0 }}>
                  {(a.firstName?.[0] || '?').toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>
                    {a.firstName} {a.lastName}
                    {a.isSuperAdmin && <span style={{ marginLeft: 8, fontSize: 10, background: '#1a1500', color: '#F5C518', border: '1px solid #F5C51833', borderRadius: 99, padding: '2px 8px', fontWeight: 900 }}>SUPER ADMIN</span>}
                    {a.id === user?.uid && <span style={{ marginLeft: 8, fontSize: 10, color: '#555' }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{a.email}</div>
                  <div style={{ fontSize: 11, color: '#444', marginTop: 4 }}>
                    {PERM_LABELS.filter(p => a.permissions?.[p.key]).map(p => p.label).join(' · ') || 'No permissions'}
                  </div>
                </div>
                {a.id !== user?.uid && !a.isSuperAdmin && (
                  <button
                    onClick={() => handleRemove(a.id, `${a.firstName} ${a.lastName}`)}
                    style={{ fontSize: 11, color: '#EF4444', background: 'none', border: '1px solid #EF444433', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create new admin */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{ background: '#F5C518', color: '#0a0a0a', border: 'none', borderRadius: 99, padding: '11px 24px', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}
        >
          + Add Admin Account
        </button>
      ) : (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24 }}>
          <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 16 }}>Create Admin Account</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {[
              { placeholder: 'First name', value: firstName, set: setFirstName },
              { placeholder: 'Last name', value: lastName, set: setLastName },
            ].map(f => (
              <input key={f.placeholder} placeholder={f.placeholder} value={f.value} onChange={e => f.set(e.target.value)}
                style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'Nunito, sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' as const }} />
            ))}
          </div>
          {[
            { placeholder: 'Email address', value: email, set: setEmail, type: 'email' },
            { placeholder: 'Temporary password (min 8 chars)', value: tempPassword, set: setTempPassword, type: 'text' },
          ].map(f => (
            <input key={f.placeholder} type={f.type} placeholder={f.placeholder} value={f.value} onChange={e => f.set(e.target.value)}
              style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'Nunito, sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' as const, marginBottom: 10 }} />
          ))}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Permissions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PERM_LABELS.map(({ key, label, danger }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: danger ? '#F5C518' : '#ccc' }}>
                  <input type="checkbox" checked={perms[key]} onChange={() => togglePerm(key)} style={{ width: 15, height: 15, accentColor: '#F5C518' }} />
                  {label}{danger ? ' ⚠️' : ''}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleCreate} disabled={creating}
              style={{ background: creating ? '#2a2000' : '#F5C518', color: creating ? '#F5C518' : '#0a0a0a', border: 'none', borderRadius: 99, padding: '10px 24px', fontWeight: 900, fontSize: 13, cursor: creating ? 'not-allowed' : 'pointer', fontFamily: 'Nunito, sans-serif' }}>
              {creating ? 'Creating...' : 'Create Admin Account'}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ background: 'none', color: '#555', border: '1px solid #2a2a2a', borderRadius: 99, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
