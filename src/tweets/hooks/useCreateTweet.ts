import { useContext, useState } from 'react';

import { TweetsContext } from '../contexts/TweetsContext';

export const useCreateTweet = () => {
  const { publish: publishTweet } = useContext(TweetsContext);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [publishedCount, setPublishedCount] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);

  const publish = async (text: string) => {
    setIsPublishing(true);

    try {
      await publishTweet(text);
      setErrorMessage('');
      setSuccessMessage('Tweet published successfully.');
      setPublishedCount((count) => count + 1);
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error instanceof Error ? error.message : 'Could not publish the tweet.');
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    publish,
    isPublishing,
    successMessage,
    errorMessage,
    publishedCount,
  };
};