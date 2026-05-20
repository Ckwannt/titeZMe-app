'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = '#EF4444',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#111',
        border: '1px solid #2a2a2a',
        borderRadius: '16px',
        padding: '28px',
        maxWidth: '360px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 900,
          color: '#fff',
          marginBottom: '8px',
          fontFamily: 'Nunito, sans-serif'
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '13px',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '24px',
          fontFamily: 'Nunito, sans-serif'
        }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '11px',
              background: 'transparent',
              border: '1px solid #2a2a2a',
              borderRadius: '99px',
              color: '#888',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '11px',
              background: confirmColor,
              border: 'none',
              borderRadius: '99px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
