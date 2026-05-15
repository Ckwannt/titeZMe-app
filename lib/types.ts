// ─── Firestore document interfaces for titeZMe ────────────────────────────────

export interface BarberProfile {
  userId: string;
  bio: string;
  city: string;
  isLive: boolean;
  isSolo: boolean;
  ownsShop: boolean;
  shopId: string | null;
  languages: string[];
  vibe: string[];
  specialties: string[];
  clientele: string[];
  photos: string[];
  rating: number;
  reviewCount: number;
  totalCuts: number;
  barberCode: string;
  currency: string;
  profilePhotoUrl?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  showPhone?: boolean;
  titeZMeCut?: {
    durationMinutes: number;
    price: number;
    currency?: string;
  };
}

export interface UserDocument {
  uid: string;
  email: string;
  role: 'client' | 'barber';
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  photoUrl?: string;
  phone?: string;
  phoneCountryCode?: string;
  isOnboarded: boolean;
  ownsShop: boolean;
  shopId?: string | null;
  favoriteBarbers: string[];
  noShowCount?: number;
  createdAt: number;
  notifyInviteResponse?: boolean;
  notifyNewBooking?: boolean;
}

export interface Barbershop {
  ownerId: string;
  name: string;
  contactPhone?: string;
  contactEmail?: string;
  description?: string;
  address: {
    street: string;
    buildingNumber?: string;
    floor?: string;
    floorSuite?: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  coverPhotoUrl?: string;
  photos: string[];
  videos?: string[];
  status: 'active' | 'inactive' | 'suspended';
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  googleMapsUrl?: string;
  currency: string;
  barbers?: string[];
  createdAt: number;
  titeZMeCut?: {
    durationMinutes: number;
    price: number;
    currency?: string;
  };
}

export interface Service {
  id?: string;
  providerId: string;
  providerType: 'barber' | 'shop';
  name: string;
  description?: string;
  duration?: number;
  durationMinutes?: number;
  price: number;
  isActive: boolean;
  sortOrder?: number;
  currency?: string;
  createdAt?: string | number;
}

export interface Booking {
  id?: string;
  clientId: string;
  clientName?: string;
  barberId: string;
  barberName?: string;
  shopId: string | null;
  bookingContext?: 'solo' | 'shop';
  serviceIds?: string[];
  serviceNames?: string[];
  serviceName?: string;
  totalDuration?: number;
  duration?: number;
  date: string;
  startTime: string;
  endTime?: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'cancelled_by_client'
    | 'cancelled_by_barber';
  paymentMethod?: 'cash';
  price: number;
  currency?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface Schedule {
  ownerId: string;
  weeklyHours?: Record<
    string,
    {
      isOpen: boolean;
      open?: string;
      close?: string;
      hasBreak?: boolean;
      breakStart?: string;
      breakEnd?: string;
    }
  >;
  availableSlots?: Record<string, string[]>;
  blockedDates?: Array<string | { date: string; reason?: string }>;
  cleanupBufferMinutes?: number;
  recurringBlocked?: string[];
  updatedAt?: number;
}

export interface Review {
  id?: string;
  bookingId?: string;
  providerId: string;
  providerType: 'barber' | 'shop';
  clientId?: string;
  clientName?: string;
  reviewerName?: string;
  barberId?: string;
  rating: number;
  comment?: string;
  text?: string;
  createdAt: number;
}

export interface Notification {
  id?: string;
  userId: string;
  title?: string;
  type?: string;
  message: string;
  read: boolean;
  linkTo?: string;
  createdAt: number;
}

export interface Invite {
  id?: string;
  shopId: string;
  shopName?: string;
  barberId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: number;
  respondedAt?: number;
}
