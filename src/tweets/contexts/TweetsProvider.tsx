import {
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { UsersContext } from '../../users/contexts/UsersContext';
import {
  createTweet,
  deleteTweet,
  setInteraction,
  subscribeToInteractions,
  updateTweet,
} from '../services/tweetService';
import type {
  InteractionType,
  TweetInteraction,
  TweetMedia,
} from '../types/tweet.types';
import { TweetsContext } from './TweetsContext';

interface TweetsProviderProps {
  children: ReactNode;
}

const getTweetIds = (
  interactions: TweetInteraction[],
  type: InteractionType,
): string[] => (
  interactions.filter((item) => item.type === type).map((item) => item.tweetId)
);

export const TweetsProvider = ({ children }: TweetsProviderProps) => {
  const { authState } = useContext(AuthContext);
  const { currentUser } = useContext(UsersContext);
  const uid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const [interactions, setInteractions] = useState<TweetInteraction[]>([]);

  useEffect(() => {
    if (!uid) return undefined;

    return subscribeToInteractions(uid, setInteractions);
  }, [uid]);

  const likedTweetIds = useMemo(() => getTweetIds(interactions, 'like'), [interactions]);
  const retweetedTweetIds = useMemo(() => getTweetIds(interactions, 'retweet'), [interactions]);

  const publish = (contentText: string, media?: TweetMedia[]) => (
    createTweet(currentUser, contentText, media)
  );

  const toggleLike = (tweetId: string) => (
    setInteraction(uid, tweetId, 'like', !likedTweetIds.includes(tweetId))
  );

  const toggleRetweet = (tweetId: string) => (
    setInteraction(uid, tweetId, 'retweet', !retweetedTweetIds.includes(tweetId))
  );

  return (
    <TweetsContext.Provider value={{
      likedTweetIds,
      retweetedTweetIds,
      publish,
      toggleLike,
      toggleRetweet,
      editTweet: updateTweet,
      removeTweet: deleteTweet,
    }}
    >
      {children}
    </TweetsContext.Provider>
  );
};