'use client';
import { useEffect, useRef } from 'react';

/** Respect user root-font preferences while preserving the normal reference layout. */
export default function TextScaling() {
  const probe = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = probe.current;
    const page = element?.closest('main');
    if (!element || !page) return;
    const measure = () => {
      const scale = element.getBoundingClientRect().width / 16;
      page.style.setProperty('--text-scale', String(Math.max(1, scale)));
      page.dataset.textScaled = scale > 1.1 ? 'true' : 'false';
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);measure();
    return () => observer.disconnect();
  }, []);
  return <span ref={probe} aria-hidden="true" style={{ position: 'absolute', width: '1rem', height: 0, overflow: 'hidden', pointerEvents: 'none' }} />;
}
