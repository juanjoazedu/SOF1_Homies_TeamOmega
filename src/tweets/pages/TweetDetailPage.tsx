import { useParams } from 'react-router-dom';

import { PageHeader } from '../../ui/components/PageHeader';
import { TweetCard } from '../components/TweetCard';
import { useTweetDetail } from '../hooks/useTweetDetail';

export const TweetDetailPage = () => {
  const { tweetId = '' } = useParams();

  const {
    tweet,
    isLoading,
    like,
    retweet,
  } = useTweetDetail(tweetId);

  if (isLoading) {
    return (
      <div className="tweet-detail-container">
        <PageHeader title="Post" />
        <p className="page-status">Loading tweet...</p>
      </div>
    );
  }

  if (!tweet) {
    return (
      <div className="tweet-detail-container">
        <PageHeader title="Post" />
        <p className="page-status">Tweet not found.</p>
      </div>
    );
  }

  return (
    <div className="tweet-detail-container">
      <PageHeader title="Post" />
      <TweetCard tweet={tweet} onLike={like} onRetweet={retweet} />
    </div>
  );
};