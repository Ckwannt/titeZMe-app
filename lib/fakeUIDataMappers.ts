import type { FakeBarber, FakeShop } from './fakeDataGenerator';
import type { BarberCard } from '@/app/barbers/page';

// ShopCard type mirrors the one in app/shops/page.tsx (not exported there).
// Keep these two in sync.
export type ShopCard = {
  id: string;
  name: string;
  coverPhotoUrl?: string;
  country: string;
  city: string;
  street: string;
  barberCount: number;
  languages: string[];
  isOpenNow: boolean;
  openLabel: string;
  openColor: string;
  hasSchedule: boolean;
  minPrice: number | null;
  currency?: string;
  isFeatured?: boolean;
};

function isOpenFromWeeklyHours(
  weeklyHours: { days: string[]; opensAt: string; closesAt: string },
): boolean {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'short' });
  const currentTime = [
    now.getHours().toString().padStart(2, '0'),
    now.getMinutes().toString().padStart(2, '0'),
  ].join(':');
  return (
    weeklyHours.days.includes(dayName) &&
    currentTime >= (weeklyHours.opensAt || '00:00') &&
    currentTime <= (weeklyHours.closesAt || '23:59')
  );
}

export function fakeToBarberCard(fake: FakeBarber): BarberCard {
  const prices = fake.services.map(s => s.price).filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const isOpenNow = isOpenFromWeeklyHours(fake.weeklyHours);

  return {
    id: fake.userId,
    firstName: fake.firstName,
    lastName: fake.lastName,
    photoUrl: fake.photoUrl,
    profilePhotoUrl: fake.profilePhotoUrl,
    city: fake.city,
    country: fake.country,
    street: '',
    languages: fake.languages,
    vibes: [],
    currency: fake.currency,
    barberCode: '',
    isOpenNow,
    openColor: isOpenNow ? 'green' : 'red',
    hasSchedule: true,
    minPrice,
  };
}

// Shops store country as full name ("Spain"), not ISO code.
const COUNTRY_NAME_BY_ISO: Record<string, string> = {
  ES: 'Spain',
};

export function fakeToShopCard(fake: FakeShop): ShopCard {
  const countryDisplay = COUNTRY_NAME_BY_ISO[fake.address.country] ?? fake.address.country;
  return {
    id: fake.shopId,
    name: fake.name,
    coverPhotoUrl: fake.coverPhotoUrl,
    country: countryDisplay,
    city: fake.address.city,
    street: fake.address.street,
    barberCount: 0,
    languages: ['es'],
    isOpenNow: true,
    openLabel: 'Open',
    openColor: 'green',
    hasSchedule: true,
    minPrice: null,
    currency: 'EUR',
    isFeatured: false,
  };
}
