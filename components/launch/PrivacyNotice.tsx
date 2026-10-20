'use client';
import { useRef } from 'react';
import styles from './launch.module.css';

export default function PrivacyNotice() {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={trigger} className={styles.privacyLink} type="button" aria-haspopup="dialog" onClick={() => { dialog.current?.showModal();heading.current?.focus({ preventScroll: true });if (dialog.current) dialog.current.scrollTop = 0; }}>Privacy notice (draft)</button>
    <dialog ref={dialog} onClose={() => trigger.current?.focus({ preventScroll: true })} className={styles.privacyDialog} aria-labelledby="privacy-heading">
      <h2 ref={heading} id="privacy-heading" tabIndex={-1}>City-notification privacy notice — draft</h2>
      <p>Registration is currently disabled. Registration requests are not sent or saved. Place searches are processed on this server; the application does not store the search text.</p>
      <p>Controller: Ibrahim MELLOULI, Cristo de la Victoria, 108, 3°B, Madrid, Spain, 28026. Contact: <a href="mailto:privacy@titezme.com">privacy@titezme.com</a>.</p>
      <p>The intended purpose is to email you when titeZMe becomes available in your selected city. No account, confirmation email, newsletter or unrelated marketing is included.</p>
      <p>The planned information is country, selected or self-declared place, email, and evidence of your notification-specific consent. Place searches run against a local GeoNames catalogue; search text is not sent to GeoNames.</p>
      <p>Neon PostgreSQL in an EU region is the intended store. No service or collection is activated by this notice. Twelve months from registration is the proposed active retention period, subject to privacy/legal review.</p>
      <p>Before collection, the final lawful-basis wording, processor arrangements and exact region, deletion deadlines, suppression and backup retention, rights-request handling, and relevant Spanish/EU requirements must be approved. This draft is not a completed legal notice or a compliance claim.</p>
      <p>You can contact privacy@titezme.com about privacy questions. A saved withdrawal receipt and a deletion mechanism are implemented for isolated testing; public enrollment remains disabled.</p>
      <button type="button" onClick={() => dialog.current?.close()}>Close privacy notice</button>
    </dialog>
  </>;
}
