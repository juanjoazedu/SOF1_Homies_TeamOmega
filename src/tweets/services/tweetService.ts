import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';

import { FirebaseDB } from '../../shared/firebase/firebaseConfig';
import type { UserSummary } from '../../users/types/user.types';
import type {
  InteractionType,
  Tweet,
  TweetDocument,
  TweetInteraction,
  TweetMedia,
} from '../types/tweet.types';

export const MAX_TWEET_LENGTH = 280;

const MAX_FEED_TWEETS = 100;
const FIRESTORE_IN_LIMIT = 30;

type CounterField = 'likesCount' | 'retweetsCount';
type TweetsListener = (tweets: Tweet[]) => void;

const COUNTER_FIELDS: Record<InteractionType, CounterField> = {
  like: 'likesCount',
  retweet: 'retweetsCount',
};

const tweetsCollection = collection(FirebaseDB, 'tweets');
const interactionsCollection = collection(FirebaseDB, 'tweetInteractions');

const getInteractionId = (uid: string, tweetId: string, type: InteractionType): string => (
  `${uid}_${tweetId}_${type}`
);

const toTweet = (snapshot: QueryDocumentSnapshot): Tweet => {
  const data = snapshot.data({ serverTimestamps: 'estimate' }) as TweetDocument;
  return { ...data, id: snapshot.id, createdAt: data.createdAt.toDate() };
};

const sortByNewest = (list: Tweet[]): Tweet[] => [...list].sort(
  (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
);

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

export const subscribeToAllTweets = (onChange: TweetsListener): Unsubscribe => onSnapshot(
  query(tweetsCollection, orderBy('createdAt', 'desc'), limit(MAX_FEED_TWEETS)),
  (snapshot) => onChange(snapshot.docs.map(toTweet)),
  () => onChange([]),
);

export const subscribeToUserTweets = (
  authorUid: string,
  onChange: TweetsListener,
): Unsubscribe => onSnapshot(
  query(tweetsCollection, where('authorUid', '==', authorUid)),
  (snapshot) => onChange(sortByNewest(snapshot.docs.map(toTweet))),
  () => onChange([]),
);

export const subscribeToAuthorsTweets = (
  authorUids: string[],
  onChange: TweetsListener,
): Unsubscribe => {
  const groups = chunk(authorUids, FIRESTORE_IN_LIMIT);
  const results: Tweet[][] = groups.map(() => []);

  const emit = () => onChange(sortByNewest(results.flat()));

  const unsubscribers = groups.map((group, index) => onSnapshot(
    query(tweetsCollection, where('authorUid', 'in', group)),
    (snapshot) => {
      results[index] = snapshot.docs.map(toTweet);
      emit();
    },
    () => {
      results[index] = [];
      emit();
    },
  ));

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};

export const subscribeToTweet = (
  tweetId: string,
  onChange: (tweet: Tweet | null) => void,
): Unsubscribe => onSnapshot(
  doc(tweetsCollection, tweetId),
  (snapshot) => onChange(snapshot.exists() ? toTweet(snapshot) : null),
  () => onChange(null),
);

export const subscribeToInteractions = (
  uid: string,
  onChange: (interactions: TweetInteraction[]) => void,
): Unsubscribe => onSnapshot(
  query(interactionsCollection, where('uid', '==', uid)),
  (snapshot) => onChange(snapshot.docs.map((item) => item.data() as TweetInteraction)),
  () => onChange([]),
);

const validateContent = (contentText: string): string => {
  const text = contentText.trim();
  if (!text) throw new Error('Tweet cannot be empty');
  if (text.length > MAX_TWEET_LENGTH) throw new Error('Tweet cannot exceed 280 characters');
  return text;
};

export const createTweet = async (
  author: UserSummary | null,
  contentText: string,
  media?: TweetMedia[],
): Promise<void> => {
  const text = validateContent(contentText);
  if (!author) throw new Error('Author not found');

  await addDoc(tweetsCollection, {
    authorUid: author.uid,
    authorFullName: author.fullName,
    authorUsername: author.username,
    contentText: text,
    likesCount: 0,
    retweetsCount: 0,
    createdAt: serverTimestamp(),
    ...(author.photoURL ? { authorPhotoURL: author.photoURL } : {}),
    ...(media?.length ? { media } : {}),
  });
};

export const setInteraction = async (
  uid: string,
  tweetId: string,
  type: InteractionType,
  isActive: boolean,
): Promise<void> => {
  const batch = writeBatch(FirebaseDB);
  const interactionRef = doc(interactionsCollection, getInteractionId(uid, tweetId, type));

  if (isActive) {
    const interaction: TweetInteraction = {
      id: interactionRef.id,
      uid,
      tweetId,
      type,
    };
    batch.set(interactionRef, interaction);
  } else {
    batch.delete(interactionRef);
  }

  batch.update(doc(tweetsCollection, tweetId), {
    [COUNTER_FIELDS[type]]: increment(isActive ? 1 : -1),
  });

  await batch.commit();
};

export const updateTweet = async (tweetId: string, contentText: string): Promise<void> => {
  await updateDoc(doc(tweetsCollection, tweetId), {
    contentText: validateContent(contentText),
    isEdited: true,
  });
};

export const deleteTweet = async (tweetId: string): Promise<void> => {
  await deleteDoc(doc(tweetsCollection, tweetId));
};