'use client';

import { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/waitlist/places';
import styles from './launch.module.css';

export interface SelectedPlace { id: string | null; name: string; region: string; missing: boolean }
export default function PlaceSearch({ country, invalid, onSelect, disabled = false, regionError }: { country: string; invalid: boolean; onSelect: (place: SelectedPlace) => void; disabled?: boolean; regionError?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [missing, setMissing] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const sequence = useRef(0);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => { if (active >= 0) container.current?.querySelector(`#place-option-${active}`)?.scrollIntoView({ block: 'nearest' }); }, [active]);
  useEffect(() => {
    const current = ++sequence.current;
    setResults([]);setActive(-1);setBusy(false);setFailed(false);
    if (disabled || !open || !country || query.trim().length < 2) { setWaiting(false);return; }
    setWaiting(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setWaiting(false);setBusy(true); setFailed(false);
      try {
        const response = await fetch('/api/places', { method: 'POST', credentials: 'same-origin', redirect: 'error', cache: 'no-store', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country, query }) });
        if (!response.ok) throw new Error('Unavailable');
        const body = await response.json() as { places?: Place[] };
        const places = Array.isArray(body.places) ? body.places.filter(place => typeof place.id === 'string' && /^geonames:[0-9]+$/.test(place.id) && typeof place.name === 'string' && typeof place.region === 'string' && place.country === country).slice(0, 20) : [];
        if (!controller.signal.aborted && current === sequence.current) { setResults(places);setActive(-1); }
      } catch { if (!controller.signal.aborted && current === sequence.current) { setResults([]);setFailed(true); } }
      finally { if (!controller.signal.aborted && current === sequence.current) setBusy(false); }
    }, 250);
    return () => { clearTimeout(timer);controller.abort(); };
  }, [country, query, open, disabled]);
  function choose(place: Place) { setQuery(place.name);setOpen(false);setMissing(false);onSelect({ id: place.id, name: place.name, region: place.region, missing: false }); }
  return <div ref={container} className={styles.placeSearch} onBlur={event => { if (!container.current?.contains(event.relatedTarget as Node)) setOpen(false); }}>
    <input id="city" role="combobox" aria-autocomplete="list" aria-expanded={open && query.trim().length >= 2} aria-controls={open && query.trim().length >= 2 ? 'place-results' : undefined} aria-activedescendant={open && active >= 0 ? `place-option-${active}` : undefined}
      aria-labelledby="city-label" aria-invalid={invalid} aria-describedby={invalid ? 'city-error' : 'place-help'} autoComplete="off" maxLength={240} required disabled={!country || disabled} placeholder="Search for your city"
      value={query} onFocus={() => setOpen(true)} onChange={event => { const value = event.target.value;++sequence.current;setResults([]);setBusy(false);setFailed(false);setWaiting(value.trim().length >= 2);setQuery(value);setOpen(true);setActive(-1);setMissing(false);onSelect({ id: null, name: value, region: '', missing: false }); }}
      onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault();setOpen(true);setActive(index => results.length ? Math.max(0, Math.min(results.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))) : -1); }
        if (event.key === 'Enter' && open && active >= 0 && results[active]) { event.preventDefault();choose(results[active]); }
        if (event.key === 'Escape') { event.preventDefault();setOpen(false); }
      }} />
    <span id="place-help" className={styles.srOnly}>Choose a country first. Search populated places, then choose a result or use the missing-place option.</span>
    {open && query.trim().length >= 2 && <div className={styles.placePopup}>
      <ul id="place-results" role="listbox" aria-label="Matching places" aria-busy={busy || waiting}>
        {results.map((place, index) => <li id={`place-option-${index}`} key={place.id} role="option" aria-selected={active === index} onMouseDown={event => event.preventDefault()} onClick={() => choose(place)}>{place.name}<small>{place.region} · {country}</small></li>)}
      </ul>
      <p role="status">{waiting ? 'Waiting for your search…' : busy ? 'Searching places…' : failed ? 'Search is unavailable. You can enter a missing place.' : results.length ? 'Choose a place above.' : 'No matching place found.'}</p>
      <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => { setMissing(true);setOpen(false);onSelect({ id: null, name: query, region: '', missing: true }); }}>My place is missing — use this name</button>
      <small>Place data: <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a></small>
    </div>}
    {missing && <label className={styles.missingRegion}>State, province or region
      <input id="placeRegion" maxLength={120} required autoComplete="address-level1" disabled={disabled} aria-invalid={!!regionError} aria-describedby={regionError ? 'placeRegion-error' : undefined} onChange={event => onSelect({ id: null, name: query, region: event.target.value, missing: true })} />
      {regionError && <small id="placeRegion-error" className={styles.error}>{regionError}</small>}
      <small>Recorded as a self-declared place; it will need matching before notification.</small>
    </label>}
  </div>;
}
