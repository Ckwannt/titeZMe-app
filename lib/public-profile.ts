/** Explicit public projections: TypeScript interfaces alone do not remove private keys. */
export function publicFields(value: Record<string, unknown>, fields: readonly string[]): Record<string, unknown> {
  return Object.fromEntries(fields.filter(key => value[key] !== undefined).map(key => [key, value[key]]));
}
export const publicPersonFields = ['firstName', 'lastName', 'photoUrl', 'city', 'country', 'createdAt'] as const;
export const publicProfessionalFields = ['userId', 'firstName', 'lastName', 'photoUrl', 'profession', 'professionTier', 'isBookable', 'bio', 'city', 'country', 'state', 'languages', 'isLive', 'isOnboarded', 'isSolo', 'ownsShop', 'approvalStatus', 'rating', 'reviewCount', 'totalCuts', 'photos', 'videos', 'profilePhotoUrl', 'instagram', 'facebook', 'tiktok', 'professionalCode', 'barberCode', 'businessId', 'currency', 'vibe', 'vibes', 'specialties', 'clientele', 'titeZMeCut', 'experienceStartYear', 'experienceVerified', 'isFake', 'createdAt'] as const;
export function isPublicProfessional(value: Record<string, unknown>): boolean {
  return value.isLive === true && value.approvalStatus === 'approved' && value.isDeleted !== true && value.isVisible !== false;
}
