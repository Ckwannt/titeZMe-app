'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  role: string;
  message: string;
  createdAt: { seconds: number } | null;
  read: boolean;
}

function formatTimestamp(ts: { seconds: number } | null): string {
  if (!ts || typeof ts.seconds !== 'number') return '—';
  const d = new Date(ts.seconds * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${month} ${day}, ${year} · ${hh}:${mm}`;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const list: ContactMessage[] = snap.docs.map(d => {
          const data = d.data() as Omit<ContactMessage, 'id'>;
          return {
            id: d.id,
            name: data.name || '',
            email: data.email || '',
            role: data.role || '',
            message: data.message || '',
            createdAt: data.createdAt || null,
            read: data.read === true,
          };
        });
        setMessages(list);
      } catch (err) {
        console.error('Failed to load contact messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { read: true });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contactMessages', id));
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Messages</h1>
        {unreadCount > 0 && (
          <span style={{ color: '#F5C518', fontSize: 13, fontWeight: 700 }}>
            {unreadCount} unread
          </span>
        )}
      </div>
      <p style={{ color: '#666', fontSize: 13, marginTop: 0, marginBottom: 24 }}>
        Contact form submissions
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#666', padding: 60 }}>Loading...</div>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: 60 }}>No messages yet.</div>
      ) : (
        <div>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                background: msg.read ? '#111' : '#1a1400',
                border: `1px solid ${msg.read ? '#2a2a2a' : '#F5C518'}`,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{msg.name}</span>
                  <span
                    style={{
                      color: '#F5C518',
                      background: '#1a1400',
                      borderRadius: 6,
                      fontSize: 11,
                      padding: '2px 8px',
                      marginLeft: 8,
                    }}
                  >
                    {msg.role}
                  </span>
                </div>
                <span style={{ color: '#666', fontSize: 12 }}>{formatTimestamp(msg.createdAt)}</span>
              </div>

              <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{msg.email}</div>

              <div style={{ color: '#ccc', fontSize: 14, marginTop: 8, whiteSpace: 'pre-wrap' }}>
                {msg.message}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {!msg.read && (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      color: '#aaa',
                      fontSize: 12,
                      borderRadius: 8,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontFamily: 'Nunito, sans-serif',
                    }}
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(msg.id)}
                  style={{
                    background: '#1a0a0a',
                    border: '1px solid #7a2222',
                    color: '#e87272',
                    fontSize: 12,
                    borderRadius: 8,
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
