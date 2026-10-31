import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { PageHeader } from '../../ui/components/PageHeader';
import { TweetCard } from '../components/TweetCard';
import { useTweet } from '../hooks/useTweet';

export const TweetDetailPage = () => {
  const { tweetId = '' } = useParams();
  const { authState } = useContext(AuthContext);
  const uid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const {
    tweet,
    isLoading,
    like,
    retweet,
  } = useTweet(tweetId, uid);

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