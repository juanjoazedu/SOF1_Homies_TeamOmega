import { createContext } from 'react';

import type { TweetsContextValue } from '../types/tweet.types';

export const TweetsContext = createContext<TweetsContextValue>({
  likedTweetIds: [],
  retweetedTweetIds: [],
  toggleLike: async () => {},
  toggleRetweet: async () => {},
  removeTweet: async () => {},
  openComposer: () => {},
  openEditor: () => {},
});