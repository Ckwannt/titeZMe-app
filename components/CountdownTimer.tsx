'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetMs: number;
  className?: string;
}

export default function CountdownTimer({ targetMs, className }: CountdownTimerProps) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = targetMs - now;
  if (remaining <= 0) return null;

  const secs = Math.floor(remaining / 1000) % 60;
  const mins = Math.floor(remaining / (1000 * 60)) % 60;
  const hours = Math.floor(remaining / (1000 * 60 * 60)) % 24;
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));

  let label: string;
  if (days >= 1) label = `${days}d ${hours}h`;
  else if (hours >= 1) label = `${hours}h ${mins}m`;
  else if (mins >= 1) label = `${mins}m ${secs}s`;
  else label = `${secs}s`;

  return (
    <span className={`tabular-nums ${className ?? ''}`}>{label}</span>
  );
}
