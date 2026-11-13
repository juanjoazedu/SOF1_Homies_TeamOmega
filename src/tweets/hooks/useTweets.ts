import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { UsersContext } from '../../users/contexts/UsersContext';
import type { FeedTab } from '../components/FeedTabs';
import { TweetsContext } from '../contexts/TweetsContext';
import {
  subscribeToAllTweets,
  subscribeToAuthorsTweets,
  subscribeToUserTweets,
} from '../services/tweetService';
import type { Tweet, TweetView } from '../types/tweet.types';

export type TweetsScope = FeedTab | 'user';

export const useTweets = (scope: TweetsScope, authorUid?: string) => {
  const { authState } = useContext(AuthContext);
  const { followingUids } = useContext(UsersContext);
  const {
    likedTweetIds,
    retweetedTweetIds,
    toggleLike,
    toggleRetweet,
  } = useContext(TweetsContext);
  const myUid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const authorsKey = scope === 'following'
    ? [myUid, ...followingUids].sort().join(',')
    : '';
  const canSubscribe = scope === 'user' ? Boolean(authorUid) : Boolean(myUid);

  useEffect(() => {
    if (!canSubscribe) return undefined;

    setIsLoading(true);
    setTweets([]);

    const handleChange = (list: Tweet[]) => {
      setTweets(list);
      setIsLoading(false);
    };

    if (scope === 'user') return subscribeToUserTweets(authorUid ?? '', handleChange);
    if (scope === 'following') {
      return subscribeToAuthorsTweets(authorsKey.split(','), handleChange);
    }
    return subscribeToAllTweets(handleChange);
  }, [canSubscribe, scope, authorUid, authorsKey]);

  const tweetViews: TweetView[] = useMemo(
    () => tweets.map((tweet) => ({
      ...tweet,
      isLiked: likedTweetIds.includes(tweet.id),
      isRetweeted: retweetedTweetIds.includes(tweet.id),
    })),
    [tweets, likedTweetIds, retweetedTweetIds],
  );

  return {
    tweets: tweetViews,
    isLoading,
    like: toggleLike,
    retweet: toggleRetweet,
  };
};