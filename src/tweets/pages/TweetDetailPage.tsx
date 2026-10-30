import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { TweetCard } from '../components/TweetCard';
import { useTweet } from '../hooks/useTweet';

export const TweetDetailPage = () => {
  const { tweetId = '' } = useParams();
  const { authState } = useContext(AuthContext);
  const uid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const { tweet, isLoading, like, retweet } = useTweet(tweetId, uid);

  if (isLoading) {
    return <p>Loading tweet...</p>;
  }

  if (!tweet) {
    return <p>Tweet not found.</p>;
  }

  return (
    <div className="tweet-detail-container">
      <TweetCard
        tweet={tweet}
        onLike={like}
        onRetweet={retweet}
      />
    </div>
  );
};