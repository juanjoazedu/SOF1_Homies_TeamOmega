import { useContext } from 'react';
import { PageHeader } from '../../ui/components/PageHeader';
import { TweetForm } from '../components/TweetForm';
import { useCreateTweet } from '../hooks/useCreateTweet';
import { UsersContext } from '../../users/contexts/UsersContext';

export const NewTweetPage = () => {
  const { currentUser } = useContext(UsersContext);

  const {
    publish,
    successMessage,
    errorMessage,
    publishedCount,
  } = useCreateTweet(currentUser);

  return (
    <div className="new-tweet-container">
      <PageHeader />

      <TweetForm key={publishedCount} onSubmit={publish} />

      {successMessage && <p role="status">{successMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
};