import { toast } from '@/lib/toast';

function getFirestoreErrorMessage(error: any): string {
  switch (error?.code) {
    case 'permission-denied':
      return "You don't have permission to do this. Please log in again.";
    case 'not-found':
      return 'This record no longer exists.';
    case 'already-exists':
      return 'This already exists.';
    case 'resource-exhausted':
      return 'Too many requests. Please wait a moment.';
    case 'unauthenticated':
      return 'Please log in to continue.';
    case 'network-request-failed':
      return 'Network error. Check your connection.';
    case 'unavailable':
      return 'Service temporarily unavailable. Try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

const RETRYABLE_CODES = ['unavailable', 'network-request-failed', 'deadline-exceeded', 'resource-exhausted'];

export async function safeFirestoreWithRetry<T>(
  operation: () => Promise<T>,
  options?: {
    maxRetries?: number;
    successMessage?: string;
    errorMessage?: string;
  }
): Promise<T | null> {
  const maxRetries = options?.maxRetries ?? 3;
  const delays = [1000, 2000, 4000];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      if (options?.successMessage) toast.success(options.successMessage);
      return result;
    } catch (error: any) {
      const isRetryable = RETRYABLE_CODES.includes(error?.code);
      const isLastAttempt = attempt === maxRetries;

      if (!isRetryable || isLastAttempt) {
        const message = options?.errorMessage ?? getFirestoreErrorMessage(error);
        toast.error(message);
        console.error('Firestore write failed after retries:', error);
        return null;
      }

      await new Promise(resolve => setTimeout(resolve, delays[attempt] ?? 4000));
    }
  }
  return null;
}

export async function safeFirestore<T>(
  operation: () => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    silent?: boolean;
    loadingToastId?: string;
  }
): Promise<T | null> {
  try {
    const result = await operation();
    if (options?.successMessage) {
      if (options.loadingToastId) {
        toast.success(options.successMessage, { id: options.loadingToastId });
      } else {
        toast.success(options.successMessage);
      }
    }
    return result;
  } catch (error: any) {
    const message = options?.errorMessage ?? getFirestoreErrorMessage(error);
    if (!options?.silent) {
      if (options?.loadingToastId) {
        toast.error(message, { id: options.loadingToastId });
      } else {
        toast.error(message);
      }
    }
    console.error('Firestore error:', {
      code: error?.code,
      message: error?.message,
      operation: operation.toString().substring(0, 100),
    });
    return null;
  }
}
