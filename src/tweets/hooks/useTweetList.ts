import { useEffect, useState } from 'react';

import { toggleLike, toggleRetweet } from '../services/tweetService';
import type { TweetView } from '../types/tweet.types';

export const useTweetList = (loadTweets: () => TweetView[], uid: string) => {
  const [tweets, setTweets] = useState<TweetView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setTweets(loadTweets());
    setIsLoading(false);
  }, [loadTweets, reloadKey]);

  const reload = () => {
    setReloadKey((key) => key + 1);
  };

  const like = (tweetId: string) => {
    toggleLike(uid, tweetId);
    reload();
  };

  const retweet = (tweetId: string) => {
    toggleRetweet(uid, tweetId);
    reload();
  };

  return {
    tweets,
    isLoading,
    like,
    retweet,
  };
};