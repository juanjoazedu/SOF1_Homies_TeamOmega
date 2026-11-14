import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { UsersContext } from '../../users/contexts/UsersContext';
import type { FeedTab } from '../components/FeedTabs';
import { TweetsContext } from '../contexts/TweetsContext';
import {
  subscribeToAllRetweets,
  subscribeToAllTweets,
  subscribeToAuthorsTweets,
  subscribeToRetweets,
  subscribeToTweetsByIds,
  subscribeToUserTweets,
} from '../services/tweetService';
import type {
  FeedItem,
  Retweet,
  Tweet,
  TweetView,
} from '../types/tweet.types';

export type TweetsScope = FeedTab | 'user';

const getRetweetersKey = (scope: TweetsScope, authorsKey: string, authorUid?: string) => {
  if (scope === 'user') return authorUid ?? '';
  if (scope === 'following') return authorsKey;
  return '';
};

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
  const [retweets, setRetweets] = useState<Retweet[]>([]);
  const [retweetedTweets, setRetweetedTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const authorsKey = scope === 'following'
    ? [myUid, ...followingUids].sort().join(',')
    : '';
  const retweetersKey = getRetweetersKey(scope, authorsKey, authorUid);
  const retweetedIdsKey = [...new Set(retweets.map((retweet) => retweet.tweetId))]
    .sort()
    .join(',');
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

  useEffect(() => {
    setRetweets([]);

    if (scope === 'for-you') {
      return myUid ? subscribeToAllRetweets(setRetweets) : undefined;
    }
    if (!retweetersKey) return undefined;

    return subscribeToRetweets(retweetersKey.split(','), setRetweets);
  }, [scope, myUid, retweetersKey]);

  useEffect(() => {
    setRetweetedTweets([]);
    if (!retweetedIdsKey) return undefined;

    return subscribeToTweetsByIds(retweetedIdsKey.split(','), setRetweetedTweets);
  }, [retweetedIdsKey]);

  const toView = (tweet: Tweet): TweetView => ({
    ...tweet,
    isLiked: likedTweetIds.includes(tweet.id),
    isRetweeted: retweetedTweetIds.includes(tweet.id),
  });

  const originalItems: FeedItem[] = tweets.map((tweet) => ({
    key: tweet.id,
    tweet: toView(tweet),
    activityAt: tweet.createdAt,
  }));

  const retweetItems: FeedItem[] = [];
  retweets.forEach((retweet) => {
    const tweet = retweetedTweets.find((item) => item.id === retweet.tweetId);

    if (tweet) {
      retweetItems.push({
        key: `${retweet.user.uid}_${tweet.id}`,
        tweet: toView(tweet),
        retweetedBy: retweet.user,
        activityAt: retweet.createdAt,
      });
    }
  });

  const latestByTweet = new Map<string, FeedItem>();
  [...originalItems, ...retweetItems].forEach((item) => {
    const current = latestByTweet.get(item.tweet.id);

    if (!current || item.activityAt.getTime() > current.activityAt.getTime()) {
      latestByTweet.set(item.tweet.id, item);
    }
  });

  const items = [...latestByTweet.values()].sort(
    (a, b) => b.activityAt.getTime() - a.activityAt.getTime(),
  );

  return {
    items,
    isLoading,
    like: toggleLike,
    retweet: toggleRetweet,
  };
};