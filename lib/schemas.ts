import { z } from "zod";

export const userSchema = z.object({
  uid: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(['client', 'barber']).optional(),
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
}).passthrough();

export type User = z.infer<typeof userSchema>;

// Used for partial updates
export const userUpdateSchema = userSchema.partial();
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export const barberSchema = z.object({
  userId: z.string().optional(),
  isLive: z.boolean().optional(),
  isSolo: z.boolean().optional(),
  shopId: z.string().nullable().optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  languages: z.array(z.string()).optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  totalCuts: z.number().optional(),
  photos: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  profilePhotoUrl: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  createdAt: z.number().optional(),
}).passthrough();

export type Barber = z.infer<typeof barberSchema>;

export const barberUpdateSchema = barberSchema.partial();
export type BarberUpdate = z.infer<typeof barberUpdateSchema>;

export const barbershopSchema = z.object({
  ownerId: z.string().optional(),
  name: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  phone: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  coverPhotoUrl: z.string().optional(),
  photos: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  createdAt: z.number().optional(),
}).passthrough();

export type Barbershop = z.infer<typeof barbershopSchema>;

export const barbershopUpdateSchema = barbershopSchema.partial();
export type BarbershopUpdate = z.infer<typeof barbershopUpdateSchema>;

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
