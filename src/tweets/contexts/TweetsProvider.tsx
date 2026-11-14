import {
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { UsersContext } from '../../users/contexts/UsersContext';
import {
  createTweet,
  deleteTweet,
  subscribeToInteractions,
  toggleInteraction,
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

  const [likedTweetIds, setLikedTweetIds] = useState<string[]>([]);
  const [retweetedTweetIds, setRetweetedTweetIds] = useState<string[]>([]);

  useEffect(() => {
    if (!uid) return undefined;

    return subscribeToInteractions(uid, (interactions) => {
      setLikedTweetIds(getTweetIds(interactions, 'like'));
      setRetweetedTweetIds(getTweetIds(interactions, 'retweet'));
    });
  }, [uid]);

  const publish = (contentText: string, media?: TweetMedia[]) => (
    createTweet(currentUser, contentText, media)
  );

  const toggleLike = async (tweetId: string) => {
    if (!currentUser) return;
    await toggleInteraction(currentUser, tweetId, 'like');
  };

  const toggleRetweet = async (tweetId: string) => {
    if (!currentUser) return;
    await toggleInteraction(currentUser, tweetId, 'retweet');
  };

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