import type { ChallengeSubmissionData } from '@/lib/schemas';

export function statusColor(
  status?: ChallengeSubmissionData['status'],
): { bg: string; text: string } {
  switch (status) {
    case 'awaiting_payment':
      return { bg: 'bg-brand-yellow/10', text: 'text-brand-yellow' };
    case 'pending':
      return { bg: 'bg-[#3b3b1a]', text: 'text-brand-yellow' };
    case 'approved':
      return { bg: 'bg-[#103a1c]', text: 'text-brand-green' };
    case 'rejected':
      return { bg: 'bg-[#3a1010]', text: 'text-brand-red' };
    default:
      return { bg: 'bg-[#1a1a1a]', text: 'text-[#888]' };
  }
}

export function buildPaymentReference(
  submission: Pick<
    ChallengeSubmissionData,
    'type' | 'userId' | 'submitterName' | 'barberCode'
  >,
): string {
  const name = submission.submitterName || '';
  if (submission.type === 'barber') {
    return `${name} - ${submission.barberCode || 'NOCODE'} - titeZMe Desafío`;
  }
  return `${name} - titeZMe Desafío`;
}
