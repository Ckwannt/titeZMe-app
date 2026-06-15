import type {NextConfig} from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: blob: firebasestorage.googleapis.com storage.googleapis.com lh3.googleusercontent.com *.firebasestorage.app picsum.photos",
      "media-src 'self' firebasestorage.googleapis.com *.firebasestorage.app",
      "connect-src 'self' *.firebaseapp.com *.googleapis.com *.firebasestorage.app *.ingest.sentry.io va.vercel-insights.com nominatim.openstreetmap.org *.algolia.net *.algolianet.com *.algolia.io wss://*.firebaseio.com https://accounts.google.com https://apis.google.com",
      "frame-src 'self' *.firebaseapp.com https://accounts.google.com https://apis.google.com",
      "worker-src 'self' blob:",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion', 'iso-639-1'],
  experimental: {
    optimizePackageImports: ['country-state-city', 'recharts'],
  },
  async headers() {
    return [
      // Security headers on every route
      {
        source: '/(.*)',
        headers: securityHeaders
      },
      // Public pages: short CDN cache, instant stale-while-revalidate
      {
        source: '/barbers',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=30, stale-while-revalidate=120' }]
      },
      {
        source: '/shops',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=30, stale-while-revalidate=120' }]
      },
      {
        source: '/barber/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' }]
      },
      {
        source: '/shop/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' }]
      },
      {
        source: '/',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' }]
      },
      // Static content pages: 1 hour CDN cache
      {
        source: '/how-it-works',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }]
      },
      {
        source: '/terms',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }]
      },
      {
        source: '/privacy',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }]
      },
      {
        source: '/contact',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }]
      }
    ];
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  org: 'titezme',
  project: 'titezme-nextjs',
  silent: true,
  disableLogger: true,
  automaticVercelMonitors: false,
});
