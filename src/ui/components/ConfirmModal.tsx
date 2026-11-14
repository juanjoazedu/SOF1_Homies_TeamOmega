import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  processingLabel: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  processingLabel,
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isProcessing) onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, onCancel]);

  return createPortal(
    <div
      className="modal-overlay"
      onClick={(event) => {
        event.stopPropagation();
        if (!isProcessing) onCancel();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="modal__title">{title}</h2>
        <p id={messageId} className="modal__message">{message}</p>

        <button
          type="button"
          className="modal__confirm"
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? processingLabel : confirmLabel}
        </button>
        <button
          type="button"
          className="modal__cancel"
          onClick={onCancel}
          disabled={isProcessing}
          autoFocus
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
};