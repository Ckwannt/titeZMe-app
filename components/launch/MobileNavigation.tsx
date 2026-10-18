'use client';

import { useRef, useState } from 'react';
import styles from './launch.module.css';

export const navigationLabels = ['Watch the film', 'Meet titiZa', 'For professionals', 'Our vision'];

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return <div className={styles.mobileNavigation} onKeyDown={event => {
    if (event.key === 'Escape') { setOpen(false); button.current?.focus(); }
  }}>
    <button ref={button} className={styles.menuButton} type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls={open ? 'launch-navigation' : undefined} onClick={() => setOpen(value => !value)}>
      <span /><span /><span />
    </button>
    {open && <nav id="launch-navigation" className={styles.mobileMenu} aria-label="Main navigation">
      {navigationLabels.map(label => <span key={label} aria-disabled="true">{label}<small>Coming soon</small></span>)}
    </nav>}
  </div>;
}
