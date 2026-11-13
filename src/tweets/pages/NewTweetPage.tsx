import { PageHeader } from '../../ui/components/PageHeader';
import { TweetForm } from '../components/TweetForm';
import { useCreateTweet } from '../hooks/useCreateTweet';

export const NewTweetPage = () => {
  const {
    publish,
    isPublishing,
    successMessage,
    errorMessage,
    publishedCount,
  } = useCreateTweet();

  return (
    <div className="new-tweet-container">
      <PageHeader />

      <TweetForm key={publishedCount} onSubmit={publish} isSubmitting={isPublishing} />

      {successMessage && <p role="status">{successMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
};