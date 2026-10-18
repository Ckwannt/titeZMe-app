import * as Sentry from '@sentry/nextjs';
import { privateWaitlistEvent } from './lib/waitlist/telemetry';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.01,
  enabled: process.env.NODE_ENV === 'production',
  integrations: [],
  beforeBreadcrumb: breadcrumb => typeof window !== 'undefined' && window.location.pathname === '/' ? null : breadcrumb,
  beforeSend: event => typeof window !== 'undefined' && window.location.pathname === '/' || privateWaitlistEvent(event) ? null : event,
  beforeSendTransaction: event => typeof window !== 'undefined' && window.location.pathname === '/' || privateWaitlistEvent(event) ? null : event,
});
