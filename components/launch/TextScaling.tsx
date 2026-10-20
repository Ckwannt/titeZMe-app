'use client';
import { useEffect, useRef } from 'react';

/** Respect enlarged text and spacing preferences without text crossing decorative ink. */
export default function TextScaling() {
  const probe = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = probe.current;
    const page = element?.closest('main');
    if (!element || !page) return;
    const readingText = [page.querySelector('h1'), page.querySelector('h1 + p')].filter((node): node is Element => node !== null);
    const measure = () => {
      const scale = element.getBoundingClientRect().width / 16;
      const spaced = readingText.some(node => {
        const style = getComputedStyle(node), font = parseFloat(style.fontSize);
        return parseFloat(style.letterSpacing) >= font * .08 || parseFloat(style.lineHeight) >= font * 1.4;
      });
      page.style.setProperty('--text-scale', String(Math.max(1, scale)));
      page.dataset.textScaled = scale > 1.1 || spaced ? 'true' : 'false';
    };
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(element);readingText.forEach(node => observer.observe(node));measure();
    return () => { observer.disconnect();cancelAnimationFrame(frame); };
  }, []);
  return <span ref={probe} aria-hidden="true" style={{ position: 'absolute', width: '1rem', height: 0, overflow: 'hidden', pointerEvents: 'none' }} />;
}
