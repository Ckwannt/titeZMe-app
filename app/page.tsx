import type { Metadata, Viewport } from 'next';
import LaunchHomepage from '@/components/launch/LaunchHomepage';

export const metadata: Metadata = {
  title: { absolute: 'titeZMe — Beauty has a brain now.' },
  description: 'Understand what suits you. Discover beauty and wellness professionals with the expertise you need. titeZMe is coming soon.',
  openGraph: {
    title: 'titeZMe — Beauty has a brain now.',
    description: 'A more intelligent beauty & wellness world. Coming soon.',
    url: 'https://titezme.com',
    images: [{ url: '/launch/scene/desktop-clean-reconstruction.webp', width: 1672, height: 941, alt: 'A sunlit beauty and wellness still-life' }],
  },
  twitter: { card: 'summary_large_image', title: 'titeZMe — Beauty has a brain now.', description: 'A more intelligent beauty & wellness world. Coming soon.', images: ['/launch/scene/desktop-clean-reconstruction.webp'] },
};

export const viewport: Viewport = { themeColor: '#efe1c9' };

export default function HomePage() {
  return <LaunchHomepage />;
}
