import type { ChallengeSubmissionData } from '@/lib/schemas';

export function statusColor(
  status?: ChallengeSubmissionData['status'],
): { bg: string; text: string; label: string } {
  switch (status) {
    case 'awaiting_payment':
      return { bg: 'bg-brand-yellow/10', text: 'text-brand-yellow', label: 'Awaiting payment' };
    case 'pending':
      return { bg: 'bg-[#3b3b1a]', text: 'text-brand-yellow', label: 'Under review' };
    case 'approved':
      return { bg: 'bg-[#103a1c]', text: 'text-brand-green', label: 'Approved' };
    case 'rejected':
      return { bg: 'bg-[#3a1010]', text: 'text-brand-red', label: 'Rejected' };
    default:
      return { bg: 'bg-[#1a1a1a]', text: 'text-[#888]', label: status || 'unknown' };
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
