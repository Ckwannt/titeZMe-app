import * as Sentry from '@sentry/nextjs';
import { isPrivateWaitlistPath, privateWaitlistEvent } from './lib/waitlist/telemetry';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
  integrations: [Sentry.httpIntegration({
    ignoreIncomingRequests: url => isPrivateWaitlistPath(url),
    ignoreIncomingRequestBody: url => isPrivateWaitlistPath(url),
    ignoreOutgoingRequests: url => isPrivateWaitlistPath(url),
  })],
  beforeSend: event => privateWaitlistEvent(event) ? null : event,
  beforeSendTransaction: event => privateWaitlistEvent(event) ? null : event,
});
