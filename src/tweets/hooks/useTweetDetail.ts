import { useContext, useEffect, useState } from 'react';

import { TweetsContext } from '../contexts/TweetsContext';
import { subscribeToTweet } from '../services/tweetService';
import type { Tweet, TweetView } from '../types/tweet.types';

export const useTweetDetail = (tweetId: string) => {
  const {
    likedTweetIds,
    retweetedTweetIds,
    toggleLike,
    toggleRetweet,
  } = useContext(TweetsContext);

  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    if (!tweetId) {
      setTweet(null);
      setIsLoading(false);
      return undefined;
    }

    return subscribeToTweet(tweetId, (data) => {
      setTweet(data);
      setIsLoading(false);
    });
  }, [tweetId]);

  const tweetView: TweetView | null = tweet
    ? {
      ...tweet,
      isLiked: likedTweetIds.includes(tweet.id),
      isRetweeted: retweetedTweetIds.includes(tweet.id),
    }
    : null;

  return {
    tweet: tweetView,
    isLoading,
    like: toggleLike,
    retweet: toggleRetweet,
  };
};