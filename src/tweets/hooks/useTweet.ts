import { useEffect, useState } from 'react';

import { getTweetById, toggleLike, toggleRetweet } from '../services/tweetService';
import type { TweetView } from '../types/tweet.types';

export const useTweet = (tweetId: string, uid: string) => {
  const [tweet, setTweet] = useState<TweetView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setTweet(getTweetById(tweetId, uid));
    setIsLoading(false);
  }, [tweetId, uid, reloadKey]);

  const reload = () => {
    setReloadKey((key) => key + 1);
  };

  const like = (id: string) => {
    toggleLike(uid, id);
    reload();
  };

  const retweet = (id: string) => {
    toggleRetweet(uid, id);
    reload();
  };

  return {
    tweet,
    isLoading,
    like,
    retweet,
  };
};