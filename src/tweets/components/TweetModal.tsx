import { useState } from 'react';

import { Modal } from '../../ui/components/Modal';
import type { Tweet } from '../types/tweet.types';
import { TweetForm } from './TweetForm';

interface TweetModalProps {
  tweet?: Tweet;
  onSubmit: (text: string) => Promise<void>;
  onClose: () => void;
}

export const TweetModal = ({ tweet, onSubmit, onClose }: TweetModalProps) => {
  const isEditing = Boolean(tweet);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (text: string) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await onSubmit(text);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : `Could not ${isEditing ? 'edit' : 'publish'} the tweet.`,
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit tweet' : 'New tweet'}
      size="large"
      isBusy={isSubmitting}
      onClose={onClose}
    >
      <TweetForm
        initialText={tweet?.contentText}
        submitLabel={isEditing ? 'Save' : 'Post'}
        submittingLabel={isEditing ? 'Saving...' : 'Posting...'}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />

      {errorMessage && <p className="modal__error" role="alert">{errorMessage}</p>}
    </Modal>
  );
};