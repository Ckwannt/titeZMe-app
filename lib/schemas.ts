import { z } from "zod";

export const userSchema = z.object({
  uid: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(['client', 'professional', 'admin']).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  isOnboarded: z.boolean().optional(),
  phone: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  favoriteBarbers: z.array(z.string()).optional(),
  photoUrl: z.string().optional(),
  ownsShop: z.boolean().optional(),
  barberCode: z.string().optional(),
  createdAt: z.number().optional(),
  challengeVotedForBarber: z.string().optional(),
  challengeVotedForShop: z.string().optional(),
}).passthrough();

export type User = z.infer<typeof userSchema>;

// Used for partial updates
export const userUpdateSchema = userSchema.partial();
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export const professionalProfileSchema = z.object({
  userId: z.string(),
  profession: z.string(),
  verificationLevel: z.enum(['self_declared', 'licensed']),
  isBookable: z.boolean(),
  bio: z.string(),
  city: z.string(),
  country: z.string(),
  languages: z.array(z.string()),
  isLive: z.boolean(),
  approvalStatus: z.enum(['pending', 'approved', 'rejected']),
  rating: z.number(),
  reviewCount: z.number(),
  totalCuts: z.number(),
  photos: z.array(z.string()),
  videos: z.array(z.string()),
  profilePhotoUrl: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  professionalCode: z.string(),
  businessId: z.string().nullable(),
  canManage: z.boolean(),
  ownsBusiness: z.boolean(),
  currency: z.string(),
  vibe: z.array(z.string()),
  specialties: z.array(z.string()),
  clientele: z.array(z.string()),
  showPhone: z.boolean().optional(),
  titeZMeCut: z.object({
    durationMinutes: z.number(),
    price: z.number(),
    currency: z.string().optional(),
  }).optional(),
  experienceStartYear: z.number().int().min(1950).max(new Date().getFullYear()).optional(),
  dateOfBirth: z.string().optional(),
  experienceLocked: z.boolean().optional(),
  experienceVerified: z.boolean().optional(),
  hasEquipment: z.boolean().optional(),
  lookingForChair: z.boolean().optional(),
  isFake: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  featuredUntil: z.number().optional(),
  profileCompletedAt: z.number().optional(),
  createdAt: z.number(),
});

export type Professional = z.infer<typeof professionalProfileSchema>;

export const professionalProfileUpdateSchema = professionalProfileSchema.partial();
export type ProfessionalUpdate = z.infer<typeof professionalProfileUpdateSchema>;

export const businessSchema = z.object({
  ownerId: z.string(),
  type: z.string(),
  name: z.string(),
  contactPhone: z.string().optional(),
  contactPhoneCountryCode: z.string().optional(),
  contactEmail: z.string().email().optional(),
  description: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    buildingNumber: z.string().optional(),
    floor: z.string().optional(),
    floorSuite: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  coverPhotoUrl: z.string().optional(),
  photos: z.array(z.string()),
  videos: z.array(z.string()),
  status: z.enum(['active', 'inactive', 'suspended']),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  facebook: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  amenities: z.array(z.string()),
  chairsCount: z.number().int().min(1).max(99).optional(),
  establishedYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  logoUrl: z.string().optional(),
  availableChairsForRent: z.number().int().nonnegative().optional(),
  rentsChairs: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  featuredUntil: z.number().optional(),
  totalBookings: z.number().int().nonnegative().optional(),
  currency: z.string(),
  createdAt: z.number(),
});

export type Business = z.infer<typeof businessSchema>;

export const businessUpdateSchema = businessSchema.partial();
export type BusinessUpdate = z.infer<typeof businessUpdateSchema>;

export const bookingSchema = z.object({
  barberId: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  servicePrice: z.number().optional(),
  serviceDuration: z.number().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  barberName: z.string().optional(),
}).passthrough();

export type Booking = z.infer<typeof bookingSchema>;

export const bookingUpdateSchema = bookingSchema.partial();
export type BookingUpdate = z.infer<typeof bookingUpdateSchema>;

export const serviceSchema = z.object({
  barberId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  durationMinutes: z.number().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.number().optional(),
}).passthrough();

export type Service = z.infer<typeof serviceSchema>;

export const serviceUpdateSchema = serviceSchema.partial();
export type ServiceUpdate = z.infer<typeof serviceUpdateSchema>;

export const scheduleSchema = z.object({
  barberId: z.string().optional(),
  availableSlots: z.record(z.string(), z.array(z.string())).optional(),
}).passthrough();

export type Schedule = z.infer<typeof scheduleSchema>;

export const scheduleUpdateSchema = scheduleSchema.partial();
export type ScheduleUpdate = z.infer<typeof scheduleUpdateSchema>;

export const inviteSchema = z.object({
  shopId: z.string().optional(),
  shopName: z.string().optional(),
  barberCode: z.string().optional(),
  status: z.enum(['pending', 'accepted', 'cancelled']).optional(),
  createdAt: z.number().optional(),
  respondedAt: z.number().optional(),
}).passthrough();

export type Invite = z.infer<typeof inviteSchema>;

export const inviteUpdateSchema = inviteSchema.partial();
export type InviteUpdate = z.infer<typeof inviteUpdateSchema>;

export const reviewSchema = z.object({
  bookingId: z.string().optional(),
  barberId: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  clientPhoto: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  createdAt: z.number().optional(),
}).passthrough();

export type Review = z.infer<typeof reviewSchema>;

export const reviewUpdateSchema = reviewSchema.partial();
export type ReviewUpdate = z.infer<typeof reviewUpdateSchema>;

export const notificationSchema = z.object({
  recipientId: z.string().optional(),
  type: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  read: z.boolean().default(false).optional(),
  createdAt: z.number().optional(),
  data: z.any().optional(),
}).passthrough();

export type Notification = z.infer<typeof notificationSchema>;

export const notificationUpdateSchema = notificationSchema.partial();
export type NotificationUpdate = z.infer<typeof notificationUpdateSchema>;

export const challengeSubmissionSchema = z.object({
  userId: z.string().optional(),
  type: z.enum(['barber', 'shop']).optional(),
  submitterName: z.string().optional(),
  submitterCity: z.string().optional(),
  submitterAvatarUrl: z.string().optional(),
  barberCode: z.string().optional(),
  shopId: z.string().optional(),
  photos: z.array(z.string()).min(1).max(4).optional(),
  videoUrl: z.string().optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['awaiting_payment', 'pending', 'approved', 'rejected']).optional(),
  declaredAmount: z.number().nonnegative().optional(),
  declaredReference: z.string().optional(),
  rejectionReason: z.string().optional(),
  voteCount: z.number().int().nonnegative().optional(),
  submittedAt: z.number().optional(),
  paidAt: z.number().optional(),
  approvedAt: z.number().optional(),
  rejectedAt: z.number().optional(),
  termsAcceptedAt: z.number().optional(),
  resubmissionCount: z.number().int().nonnegative().optional(),
}).passthrough();
export type ChallengeSubmissionData = z.infer<typeof challengeSubmissionSchema>;
export const challengeSubmissionUpdateSchema = challengeSubmissionSchema.partial();
export type ChallengeSubmissionUpdate = z.infer<typeof challengeSubmissionUpdateSchema>;


export const challengeVoteSchema = z.object({
  voterUid: z.string().optional(),
  type: z.enum(['barber', 'shop']).optional(),
  submissionId: z.string().optional(),
  votedAt: z.number().optional(),
}).passthrough();
export type ChallengeVoteData = z.infer<typeof challengeVoteSchema>;
export const challengeVoteUpdateSchema = challengeVoteSchema.partial();
export type ChallengeVoteUpdate = z.infer<typeof challengeVoteUpdateSchema>;


export const challengeSettingsSchema = z.object({
  submissionsOpenAt: z.number().optional(),
  submissionsCloseAt: z.number().optional(),
  votingOpenAt: z.number().optional(),
  votingCloseAt: z.number().optional(),
  ibanText: z.string().optional(),
  accountHolderName: z.string().optional(),
  referencePhotos: z.array(z.string()).max(4).optional(),
  referencePhotoLabels: z.array(z.string()).max(4).optional(),
  fakeBarberCount: z.number().int().nonnegative().optional(),
  fakeShopCount: z.number().int().nonnegative().optional(),
  publicLeaderboardEnabled: z.boolean().optional(),
  feeBarber: z.number().nonnegative().optional(),
  feeShop: z.number().nonnegative().optional(),
  ivaRate: z.number().nonnegative().optional(),
  prizeBarberValue: z.number().nonnegative().optional(),
  prizeShopValue: z.number().nonnegative().optional(),
  showHomepageBox: z.boolean().optional(),
}).passthrough();
export type ChallengeSettingsData = z.infer<typeof challengeSettingsSchema>;
export const challengeSettingsUpdateSchema = challengeSettingsSchema.partial();
export type ChallengeSettingsUpdate = z.infer<typeof challengeSettingsUpdateSchema>;
