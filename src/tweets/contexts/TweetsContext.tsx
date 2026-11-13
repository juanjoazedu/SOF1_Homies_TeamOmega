import { createContext } from 'react';

import type { TweetsContextValue } from '../types/tweet.types';

export const TweetsContext = createContext<TweetsContextValue>({
  likedTweetIds: [],
  retweetedTweetIds: [],
  publish: async () => {},
  toggleLike: async () => {},
  toggleRetweet: async () => {},
  editTweet: async () => {},
  removeTweet: async () => {},
});