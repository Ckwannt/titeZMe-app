'use client';
import { useState } from 'react';
import { enrollmentAllowed } from '@/lib/waitlist/release';
import styles from './launch.module.css';

export default function ReceiptControls({ receipt }: { receipt: string }) {
  const [status, setStatus] = useState('Keep this receipt privately. It controls only a new subscription created by this request; it cannot change an earlier registration.');
  const [busy, setBusy] = useState(false);
  async function remove(action: 'withdraw' | 'delete') {
    if (!enrollmentAllowed()) { setStatus('This service is not yet active.');return; }
    setBusy(true);
    try {
      const response = await fetch(`/api/waitlist/${action}`, { method: 'POST', credentials: 'same-origin', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10000), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receipt }) });
      setStatus(response.ok ? 'Your request has been processed. A valid receipt stops future notifications; an approved suppression marker may be retained.' : 'We could not confirm processing. Please retry or contact privacy@titezme.com.');
    } catch { setStatus('We could not confirm processing. Please retry or contact privacy@titezme.com.'); }
    finally { setBusy(false); }
  }
  return <div className={styles.receipt} data-sentry-block>
    <label>Private withdrawal receipt <input readOnly value={receipt} onFocus={event => event.target.select()} /></label>
    <button type="button" disabled={busy} onClick={() => remove('withdraw')}>Withdraw notification request</button>
    <button type="button" disabled={busy} onClick={() => remove('delete')}>Request deletion</button>
    <p role="status">{status}</p>
  </div>;
}
