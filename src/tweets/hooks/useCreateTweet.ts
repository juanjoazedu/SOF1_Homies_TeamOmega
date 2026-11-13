import { useState } from 'react';

import { createTweet } from '../services/tweetService';

import type { UserSummary } from '../../users/types/user.types';

export const useCreateTweet = (author: UserSummary | null) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [publishedCount, setPublishedCount] = useState(0);

  const publish = (text: string) => {
    try {
      createTweet(author, text);
      setErrorMessage('');
      setSuccessMessage('Tweet published successfully.');
      setPublishedCount((count) => count + 1);
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error instanceof Error ? error.message : 'Could not publish the tweet.');
    }
  };

  return {
    publish,
    successMessage,
    errorMessage,
    publishedCount,
  };
};