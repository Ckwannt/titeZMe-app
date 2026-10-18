'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Country } from 'country-state-city';
import { waitlistFields, waitlistErrorMessage, CONSENT_VERSION, PRIVACY_VERSION } from '@/lib/waitlist/contract';
import type { WaitlistErrors } from '@/lib/waitlist/contract';
import { validateWaitlist } from '@/lib/waitlist/validation';
import { submitWaitlist } from '@/lib/waitlist/client';
import PlaceSearch from './PlaceSearch';
import type { SelectedPlace } from './PlaceSearch';
import PrivacyNotice from './PrivacyNotice';
import ReceiptControls from './ReceiptControls';
import styles from './launch.module.css';

const countries = Country.getAllCountries();

export default function WaitlistForm() {
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'inactive' | 'processed' | 'retry' | 'limited'>('idle');
  const [country, setCountry] = useState('');
  const [place, setPlace] = useState<SelectedPlace>({ id: null, name: '', region: '', missing: false });
  const [receipt, setReceipt] = useState('');
  const pending = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const inputValue = (field: string) => (form.elements.namedItem(field) as HTMLInputElement | HTMLSelectElement).value;
    const validation = validateWaitlist({ country: inputValue('country'), city: inputValue('city'), email: inputValue('email'), placeId: place.id, placeRegion: place.region, missingPlace: place.missing, consent: (form.elements.namedItem('consent') as HTMLInputElement).checked, consentVersion: CONSENT_VERSION, privacyVersion: PRIVACY_VERSION });
    const invalid = !validation.valid && validation.error.code === 'validation_failed' ? validation.error.fields : {};
    setErrors(invalid);
    setStatus('idle');
    const first = waitlistFields.find(field => invalid[field]);
    if (first) { (form.elements.namedItem(first) as HTMLElement).focus(); return; }
    if (!validation.valid) { setStatus('inactive'); return; }
    pending.current = true;
    setStatus('loading');
    try {
      // Allow the pending state to render; the transport is hard-disabled and never sends input.
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const response = await submitWaitlist(validation.value);
      if ('status' in response && response.status === 'processed') { setReceipt(response.withdrawalReceipt);setStatus('processed');return; }
      if ('code' in response && response.code === 'validation_failed') {
        setErrors(response.fields);
        const field = waitlistFields.find(key => response.fields[key]);
        if (field) (form.elements.namedItem(field) as HTMLElement).focus();
      }
      setStatus('code' in response && response.code === 'rate_limited' ? 'limited' : 'code' in response && (response.code === 'processing_unconfirmed' || response.code === 'idempotency_conflict') ? 'retry' : 'inactive');
    } catch {
      setStatus('retry');
    } finally {
      pending.current = false;
    }
  }

  return <section className={styles.waitlist} aria-labelledby="waitlist-title">
    <span className={styles.paperTape} aria-hidden="true" />
    <h2 id="waitlist-title">Be the first to know.</h2>
    <p>Join the list and we&apos;ll email you when titeZMe becomes available<br className={styles.desktopBreak} /> in your city.</p>
    {/* IDs deliberately replace names: native submission cannot serialize details before hydration. */}
    <form className={styles.form} noValidate onSubmit={submit} aria-describedby="signup-status" data-sentry-mask>
      <div className={styles.countryField}>
        <label className={styles.control}><span className={styles.globe} aria-hidden="true" /><span id="country-label" className={styles.srOnly}>Country</span>
          <select id="country" aria-labelledby="country-label" required value={country} onChange={event => { setCountry(event.target.value);setPlace({ id: null, name: '', region: '', missing: false }); }} aria-invalid={!!errors.country} aria-describedby={errors.country ? 'country-error' : undefined}>
            <option value="" disabled>Country</option>
            {countries.map(country => <option key={country.isoCode} value={country.isoCode}>{country.name}</option>)}
          </select>
        </label>
        {errors.country && <small id="country-error" className={styles.error}>{waitlistErrorMessage('country', errors.country)}</small>}
      </div>
      <div className={styles.cityField}>
        <div className={styles.control}><span className={styles.pin} aria-hidden="true" /><span id="city-label" className={styles.srOnly}>City</span>
          <PlaceSearch key={country} country={country} invalid={!!errors.city} onSelect={setPlace} />
        </div>
        {errors.city && <small id="city-error" className={styles.error}>{waitlistErrorMessage('city', errors.city)}</small>}
      </div>
      <div className={styles.emailField}>
        <label className={styles.control}><span aria-hidden="true">✉</span><span id="email-label" className={styles.srOnly}>Email address</span>
          <input id="email" aria-labelledby="email-label" type="email" autoComplete="email" maxLength={254} required placeholder="Your email address" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
        </label>
        {errors.email && <small id="email-error" className={styles.error}>{waitlistErrorMessage('email', errors.email)}</small>}
      </div>
      <div className={styles.consentField}>
        <label><input id="consent" type="checkbox" required defaultChecked={false} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-error' : undefined} />
          <span>I agree to receive an email from titeZMe when it becomes available in my selected city.</span></label>
        <PrivacyNotice />
        {errors.consent && <small id="consent-error" className={styles.error}>{waitlistErrorMessage('consent', errors.consent)}</small>}
      </div>
      <button className={styles.submit} type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>{status === 'loading' ? 'Checking details…' : <>Keep me in the loop <span aria-hidden="true">→</span></>}</button>
    </form>
    <p id="signup-status" className={styles.signupStatus} role="status">{status === 'processed' ? <>Thanks! We&apos;ve received your request. If this is your first registration, you&apos;re on the list. We&apos;ll notify you when titeZMe becomes available in the city you originally selected.</> : status === 'loading' ? 'Processing your request…' : status === 'retry' ? 'We could not confirm processing. Please retry. No successful registration is confirmed.' : status === 'limited' ? 'Too many attempts. Please wait before retrying.' : 'Signup is not yet active. No registration has been submitted.'}</p>
    {status === 'processed' && <ReceiptControls receipt={receipt} />}
    {Object.keys(errors).length > 0 && <span className={styles.srOnly} role="alert">Please check the highlighted fields.</span>}
  </section>;
}
