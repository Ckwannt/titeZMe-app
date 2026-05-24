'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { auth, db } from '@/lib/firebase';
import {
  deleteClientAccount,
  deleteBarberAccount,
  deleteShopOwnerAccount,
  reauthenticateUser,
} from '@/lib/delete-account';

interface DeleteAccountButtonProps {
  role: 'client' | 'barber';
}

const clientMessage = `This cannot be undone.

What happens immediately:
- You are logged out
- Your profile is deleted
- Your personal data is removed
- Future bookings are cancelled and your barber is notified

What stays (anonymized):
- Past completed bookings appear as Anonymous
- Reviews you left stay on barber profiles anonymized (barbers keep their ratings)`;

const barberMessage = `This cannot be undone.

What happens immediately:
- You are logged out
- Your barber profile is deleted
- You disappear from titeZMe
- Future bookings are cancelled and clients are notified
- Your services and schedule are deleted

What stays:
- Your cut count stays with any shops you worked at
- Past booking records stay anonymized as Former Barber
- If you were in a shop the shop keeps its historical cut counts`;

export function DeleteAccountButton({ role }: DeleteAccountButtonProps) {
  const { user, appUser } = useAuth();
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showReauth, setShowReauth] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [error, setError] = useState('');

  const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com') ?? false;

  const handleDelete = async () => {
    if (!user?.uid || !appUser?.role) return;

    setDeleting(true);
    setError('');

    try {
      if (appUser.role === 'client') {
        await deleteClientAccount(user.uid);
      } else if (appUser.role === 'barber') {
        const profileSnap = await getDoc(doc(db, 'barberProfiles', user.uid));
        const profile = profileSnap.data();
        const shopId = profile?.shopId || null;
        const ownsShop = profile?.ownsShop || false;

        if (ownsShop && shopId) {
          await deleteShopOwnerAccount(user.uid, shopId);
        } else {
          await deleteBarberAccount(user.uid);
        }
      }

      await signOut(auth);
      router.replace('/');
    } catch (err: any) {
      if (err?.code === 'auth/requires-recent-login') {
        setShowReauth(true);
        setShowConfirm(false);
      } else {
        console.error('Delete account error:', err);
        setError('Failed to delete account. Please try again.');
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleReauth = async () => {
    setDeleting(true);
    setError('');

    try {
      await reauthenticateUser(isGoogleUser ? undefined : reauthPassword);
      setShowReauth(false);
      setReauthPassword('');
      await handleDelete();
    } catch (err: any) {
      console.error('Reauth error:', err);
      setError(isGoogleUser ? 'Re-authentication failed. Please try again.' : 'Incorrect password. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => {
          setShowConfirm(true);
          setError('');
        }}
        style={{
          background: 'transparent',
          border: '1px solid #EF444433',
          color: '#EF4444',
          borderRadius: '99px',
          padding: '10px 20px',
          fontSize: '13px',
          fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'Nunito, sans-serif',
        }}
      >
        Delete account
      </button>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: 900,
                color: '#fff',
                marginBottom: '16px',
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              {role === 'client' ? 'Delete your account?' : 'Delete your barber account?'}
            </div>

            <div
              style={{
                fontSize: '13px',
                color: '#666',
                lineHeight: 1.8,
                marginBottom: '24px',
                fontFamily: 'Nunito, sans-serif',
                whiteSpace: 'pre-line',
              }}
            >
              {role === 'client' ? clientMessage : barberMessage}
            </div>

            {error && (
              <div
                style={{
                  background: '#1a0808',
                  border: '1px solid #EF444433',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  color: '#EF4444',
                  marginBottom: '16px',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  background: deleting ? '#2a0808' : '#EF4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '99px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  width: '100%',
                }}
              >
                {deleting ? 'Deleting...' : 'Delete everything →'}
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  setError('');
                }}
                disabled={deleting}
                style={{
                  background: 'transparent',
                  color: '#888',
                  border: '1px solid #2a2a2a',
                  borderRadius: '99px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  width: '100%',
                }}
              >
                Keep my account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-auth dialog — appears when delete fails with auth/requires-recent-login */}
      {showReauth && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '380px',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#fff',
                marginBottom: '8px',
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              Confirm your identity
            </div>
            <div
              style={{
                fontSize: '13px',
                color: '#555',
                marginBottom: '20px',
                lineHeight: 1.6,
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              For security please confirm your identity before we delete your account.
            </div>

            {error && (
              <div
                style={{
                  background: '#1a0808',
                  border: '1px solid #EF444433',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  color: '#EF4444',
                  marginBottom: '16px',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                {error}
              </div>
            )}

            {isGoogleUser ? (
              <button
                onClick={handleReauth}
                disabled={deleting}
                style={{
                  width: '100%',
                  background: '#fff',
                  border: 'none',
                  borderRadius: '99px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  color: '#0a0a0a',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {deleting ? 'Verifying...' : 'Confirm with Google'}
              </button>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Your password"
                  value={reauthPassword}
                  onChange={e => setReauthPassword(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !deleting && reauthPassword) {
                      handleReauth();
                    }
                  }}
                  style={{
                    width: '100%',
                    background: '#141414',
                    border: '1px solid #2a2a2a',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '16px',
                    fontFamily: 'Nunito, sans-serif',
                    outline: 'none',
                    marginBottom: '12px',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={handleReauth}
                  disabled={deleting || !reauthPassword}
                  style={{
                    width: '100%',
                    background: !reauthPassword || deleting ? '#2a0808' : '#EF4444',
                    border: 'none',
                    borderRadius: '99px',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 900,
                    cursor: !reauthPassword || deleting ? 'not-allowed' : 'pointer',
                    color: '#fff',
                    fontFamily: 'Nunito, sans-serif',
                    marginBottom: '10px',
                  }}
                >
                  {deleting ? 'Verifying...' : 'Confirm deletion'}
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowReauth(false);
                setReauthPassword('');
                setError('');
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#555',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                padding: '8px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
