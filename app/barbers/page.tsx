// Thin server wrapper — data fetched client-side in BarbersClient
import BarbersClient from './BarbersClient';

export const metadata = {
  title: 'Find a Barber',
  description: 'Browse top-rated barbers by city. Real availability. Book in seconds on titeZMe.',
};

export type BarberCard = {
  id: string;
  profilePhotoUrl?: string;
  photoUrl?: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  street: string;
  languages: string[];
  vibes: string[];
  currency?: string;
  barberCode: string;
  isOpenNow: boolean;
  openLabel: string;
  openColor: string;
  hasSchedule: boolean;
  minPrice: number | null;
};

export default function BarbersPage() {
  // Data is fetched client-side inside BarbersClient using the Firebase
  // client SDK. This keeps the page working without Firebase Admin creds.
  return <BarbersClient />;
}
