import {
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { Toast } from '../../ui/components/Toast';
import { UsersContext } from '../../users/contexts/UsersContext';
import { TweetModal } from '../components/TweetModal';
import {
  createTweet,
  deleteTweet,
  subscribeToInteractions,
  toggleInteraction,
  updateTweet,
} from '../services/tweetService';
import type {
  InteractionType,
  Tweet,
  TweetInteraction,
} from '../types/tweet.types';
import { TweetsContext } from './TweetsContext';

const NOTICE_DURATION_MS = 1500;

interface TweetsProviderProps {
  children: ReactNode;
}

interface ComposerState {
  tweet?: Tweet;
}

interface Notice {
  message: string;
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
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!uid) return undefined;

    return subscribeToInteractions(uid, (interactions) => {
      setLikedTweetIds(getTweetIds(interactions, 'like'));
      setRetweetedTweetIds(getTweetIds(interactions, 'retweet'));
    });
  }, [uid]);

  useEffect(() => {
    if (!notice) return undefined;

    const timeoutId = window.setTimeout(() => setNotice(null), NOTICE_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const toggleLike = async (tweetId: string) => {
    if (!currentUser) return;
    await toggleInteraction(currentUser, tweetId, 'like');
  };

  const toggleRetweet = async (tweetId: string) => {
    if (!currentUser) return;
    await toggleInteraction(currentUser, tweetId, 'retweet');
  };

  const openComposer = () => setComposer({});

  const openEditor = (tweet: Tweet) => setComposer({ tweet });

  const closeComposer = () => setComposer(null);

  const submitComposer = async (text: string) => {
    if (composer?.tweet) {
      await updateTweet(composer.tweet.id, text);
      setNotice({ message: 'Tweet edited successfully.' });
    } else {
      await createTweet(currentUser, text);
      setNotice({ message: 'Tweet published successfully.' });
    }

    setComposer(null);
  };

  return (
    <TweetsContext.Provider value={{
      likedTweetIds,
      retweetedTweetIds,
      toggleLike,
      toggleRetweet,
      removeTweet: deleteTweet,
      openComposer,
      openEditor,
    }}
    >
      {children}

      {composer && (
        <TweetModal
          tweet={composer.tweet}
          onSubmit={submitComposer}
          onClose={closeComposer}
        />
      )}

      {notice && <Toast message={notice.message} />}
    </TweetsContext.Provider>
  );
};