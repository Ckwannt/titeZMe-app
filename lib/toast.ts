import { toast as hotToast } from 'react-hot-toast';

const baseStyle = {
  background: '#111',
  color: '#fff',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: '700',
};

export const toast = {
  success: (message: string, options?: { id?: string }) =>
    hotToast.success(message, {
      id: options?.id,
      style: { ...baseStyle, border: '1px solid #22C55E33' },
      iconTheme: { primary: '#22C55E', secondary: '#0a0a0a' },
      duration: 3000,
    }),

  error: (message: string, options?: { id?: string }) =>
    hotToast.error(message, {
      id: options?.id,
      style: { ...baseStyle, border: '1px solid #EF444433' },
      iconTheme: { primary: '#EF4444', secondary: '#0a0a0a' },
      duration: 4000,
    }),

  info: (message: string, options?: { id?: string }) =>
    hotToast(message, {
      id: options?.id,
      style: { ...baseStyle, border: '1px solid #F5C51833' },
      icon: '💡',
      duration: 3000,
    }),

  loading: (message: string, options?: { id?: string }) =>
    hotToast.loading(message, {
      id: options?.id,
      style: { ...baseStyle, border: '1px solid #2a2a2a' },
    }),

  dismiss: hotToast.dismiss,
};
