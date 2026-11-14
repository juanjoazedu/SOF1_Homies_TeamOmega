import { Modal } from './Modal';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  processingLabel: string;
  variant?: 'primary' | 'danger';
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  processingLabel,
  variant = 'primary',
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const confirmClass = variant === 'danger'
    ? 'modal__confirm modal__confirm--danger'
    : 'modal__confirm';

  return (
    <Modal title={title} description={message} isBusy={isProcessing} onClose={onCancel}>
      <button
        type="button"
        className={confirmClass}
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
    </Modal>
  );
};