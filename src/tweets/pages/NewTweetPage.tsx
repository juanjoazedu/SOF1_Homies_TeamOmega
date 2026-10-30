import { useContext } from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { TweetForm } from '../components/TweetForm';
import { useCreateTweet } from '../hooks/useCreateTweet';

export const NewTweetPage = () => {
  const { authState } = useContext(AuthContext);
  const uid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const {
    publish,
    successMessage,
    errorMessage,
    publishedCount,
  } = useCreateTweet(uid);

  return (
    <div className="new-tweet-container">
      <h2>New tweet</h2>

      <TweetForm key={publishedCount} onSubmit={publish} />

      {successMessage && <p role="status">{successMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
};