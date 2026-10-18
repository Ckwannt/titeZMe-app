import type { SqlClient } from './service';

/** Native HTTPS adapter for Neon's SQL HTTP endpoint; no browser credential exposure. */
export function neonSql(connectionString: string): SqlClient {
  const connection = new URL(connectionString);
  if (!['postgres:', 'postgresql:'].includes(connection.protocol) || !connection.hostname.endsWith('.neon.tech') || decodeURIComponent(connection.username) !== 'waitlist_ingest') throw new Error('Restricted waitlist database configuration required');
  const endpoint = `https://${connection.hostname.replace(/^[^.]+\./, 'api.')}/sql`;
  return {
    async query<T>(query: string, params: unknown[]) {
      const response = await fetch(endpoint, { method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000), headers: { 'Content-Type': 'application/json', 'Neon-Connection-String': connectionString, 'Neon-Array-Mode': 'false', 'Neon-Raw-Text-Output': 'false' }, body: JSON.stringify({ query, params }) });
      if (!response.ok) throw new Error('Waitlist storage unavailable');
      const body: unknown = await response.json();
      if (!body || typeof body !== 'object' || !('rows' in body) || !Array.isArray(body.rows)) throw new Error('Waitlist storage unavailable');
      return { rows: body.rows as T[] };
    },
  };
}
