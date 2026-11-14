import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  title: string;
  description?: string;
  size?: 'small' | 'large';
  isBusy?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({
  title,
  description,
  size = 'small',
  isBusy = false,
  onClose,
  children,
}: ModalProps) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isBusy, onClose]);

  return createPortal(
    <div
      className="modal-overlay"
      onClick={(event) => {
        event.stopPropagation();
        if (!isBusy) onClose();
      }}
    >
      <div
        className={size === 'large' ? 'modal modal--large' : 'modal'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="modal__title">{title}</h2>
        {description && <p id={descriptionId} className="modal__description">{description}</p>}
        {children}
      </div>
    </div>,
    document.body,
  );
};