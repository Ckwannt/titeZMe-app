// ─── Firestore document interfaces for titeZMe ────────────────────────────────

export interface ProfessionalProfile {
  userId: string;
  profession: string;
  professionTier: 'artist' | 'specialist';
  isBookable: boolean;
  bio: string;
  city: string;
  country: string;
  state?: string;
  languages: string[];
  isLive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
  reviewCount: number;
  totalCuts: number;
  photos: string[];
  videos: string[];
  profilePhotoUrl?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  professionalCode: string;
  businessId: string | null;
  canManage: boolean;
  ownsBusiness: boolean;
  currency: string;
  vibe: string[];
  specialties: string[];
  clientele: string[];
  showPhone?: boolean;
  titeZMeCut?: {
    durationMinutes: number;
    price: number;
    currency?: string;
  };
  experienceStartYear?: number;
  dateOfBirth?: string;
  experienceLocked?: boolean;
  experienceVerified?: boolean;
  hasEquipment?: boolean;
  lookingForChair?: boolean;
  isFake?: boolean;
  isVisible?: boolean;
  isDeleted?: boolean;
  isFeatured?: boolean;
  featuredUntil?: number;
  profileCompletedAt?: number;
  createdAt: number;
}

export interface UserDocument {
  uid: string;
  email: string;
  role: 'client' | 'professional' | 'admin';
  firstName: string;
  lastName: string;
  city: string;
  state?: string;
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
  unreadCount?: number;
  challengeVotedForBarber?: string;
  challengeVotedForShop?: string;
}

export interface Business {
  ownerId: string;
  type: string;
  name: string;
  contactPhone?: string;
  contactPhoneCountryCode?: string;
  contactEmail?: string;
  description?: string;
  address: {
    street?: string;
    buildingNumber?: string;
    floor?: string;
    floorSuite?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  coverPhotoUrl?: string;
  photos: string[];
  videos: string[];
  status: 'active' | 'inactive' | 'suspended';
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  googleMapsUrl?: string;
  amenities: string[];
  chairsCount?: number;
  establishedYear?: number;
  logoUrl?: string;
  availableChairsForRent?: number;
  rentsChairs?: boolean;
  isFeatured?: boolean;
  featuredUntil?: number;
  totalBookings?: number;
  currency: string;
  createdAt: number;
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

export interface AdminPermissions {
  canApproveBarbers: boolean;
  canApproveShops: boolean;
  canManageReviews: boolean;
  canManageBookings: boolean;
  canManageChallenge: boolean;
  canManageUsers: boolean;
  canManageFeatured: boolean;
  canCreateAdmins: boolean;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin';
  isAdmin: true;
  isSuperAdmin: boolean;
  firstName: string;
  lastName: string;
  createdAt: number;
  permissions: AdminPermissions;
}

export interface ChallengeSubmission {
  userId: string;
  type: 'barber' | 'shop';
  submitterName: string;
  submitterCity: string;
  submitterAvatarUrl?: string;
  barberCode?: string;
  shopId?: string;
  photos: string[];
  videoUrl?: string;
  description: string;
  status: 'awaiting_payment' | 'pending' | 'approved' | 'rejected';
  declaredAmount?: number;
  declaredReference?: string;
  rejectionReason?: string;
  voteCount: number;
  submittedAt: number;
  paidAt?: number;
  approvedAt?: number;
  rejectedAt?: number;
  termsAcceptedAt: number;
  resubmissionCount: number;
}

export interface ChallengeVote {
  voterUid: string;
  type: 'barber' | 'shop';
  submissionId: string;
  votedAt: number;
}

export interface ChallengeSettings {
  submissionsOpenAt: number;
  submissionsCloseAt: number;
  votingOpenAt: number;
  votingCloseAt: number;
  ibanText: string;
  bizumNumber: string;
  referencePhotos: string[];
  referencePhotoLabels: string[];
  fakeBarberCount: number;
  fakeShopCount: number;
  publicLeaderboardEnabled: boolean;
  feeBarber: number;
  feeShop: number;
  prizeBarberValue: number;
  prizeShopValue: number;
  showHomepageBox?: boolean;
  eventDate?: string;
  challengeMode?: boolean;
  challengeModeEndDate?: string;
  accountHolderName?: string;
}
