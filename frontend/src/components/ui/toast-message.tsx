import { useEffect } from 'react';

type ToastTone = 'error' | 'success';

interface ToastMessageProps {
  message: string;
  onDismiss: () => void;
  tone: ToastTone;
}

export const ToastMessage = ({
  message,
  onDismiss,
  tone,
}: ToastMessageProps): JSX.Element => {
  useEffect(() => {
    const dismissTimerId = window.setTimeout(() => {
      onDismiss();
    }, 3200);

    return () => {
      window.clearTimeout(dismissTimerId);
    };
  }, [onDismiss]);

  return (
    <div
      aria-live="polite"
      className={`toast-message toast-message-${tone}`}
      role="status"
    >
      <span>{message}</span>
      <button
        aria-label="Dismiss message"
        className="toast-dismiss-button"
        onClick={onDismiss}
        type="button"
      >
        ×
      </button>
    </div>
  );
};
