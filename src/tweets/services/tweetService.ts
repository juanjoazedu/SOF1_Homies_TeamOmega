import {
  addDoc,
  collection,
  deleteField,
  doc,
  documentId,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Query,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore';

import { FirebaseDB } from '../../shared/firebase/firebaseConfig';
import { deleteFile, uploadFile } from '../../shared/firebase/storageService';
import { getFileError, isVideoFile, MAX_TWEET_MEDIA } from '../../shared/utils/mediaFiles';
import { toUserSummary } from '../../users/services/userService';
import type { UserSummary } from '../../users/types/user.types';
import type {
  InteractionDocument,
  InteractionType,
  Retweet,
  Tweet,
  TweetDocument,
  TweetDraft,
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

const toTweets = (snapshot: QuerySnapshot): Tweet[] => snapshot.docs.map(toTweet);

const toRetweets = (snapshot: QuerySnapshot): Retweet[] => {
  const retweets: Retweet[] = [];

  snapshot.docs.forEach((item) => {
    const data = item.data({ serverTimestamps: 'estimate' }) as InteractionDocument;

    if (data.createdAt && data.user) {
      retweets.push({
        tweetId: data.tweetId,
        user: data.user,
        createdAt: data.createdAt.toDate(),
      });
    }
  });

  return retweets;
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

const subscribeInGroups = <T>(
  values: string[],
  buildQuery: (group: string[]) => Query,
  mapSnapshot: (snapshot: QuerySnapshot) => T[],
  onChange: (items: T[]) => void,
): Unsubscribe => {
  const groups = chunk(values, FIRESTORE_IN_LIMIT);

  if (groups.length === 0) {
    onChange([]);
    return () => {};
  }

  const results: T[][] = groups.map(() => []);
  const emit = () => onChange(results.flat());

  const unsubscribers = groups.map((group, index) => onSnapshot(
    buildQuery(group),
    (snapshot) => {
      results[index] = mapSnapshot(snapshot);
      emit();
    },
    () => {
      results[index] = [];
      emit();
    },
  ));

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};

export const subscribeToAllTweets = (onChange: TweetsListener): Unsubscribe => onSnapshot(
  query(tweetsCollection, orderBy('createdAt', 'desc'), limit(MAX_FEED_TWEETS)),
  (snapshot) => onChange(toTweets(snapshot)),
  () => onChange([]),
);

export const subscribeToUserTweets = (
  authorUid: string,
  onChange: TweetsListener,
): Unsubscribe => onSnapshot(
  query(tweetsCollection, where('authorUid', '==', authorUid)),
  (snapshot) => onChange(sortByNewest(toTweets(snapshot))),
  () => onChange([]),
);

export const subscribeToAuthorsTweets = (
  authorUids: string[],
  onChange: TweetsListener,
): Unsubscribe => subscribeInGroups(
  authorUids,
  (group) => query(tweetsCollection, where('authorUid', 'in', group)),
  toTweets,
  (tweets) => onChange(sortByNewest(tweets)),
);

export const subscribeToTweetsByIds = (
  tweetIds: string[],
  onChange: TweetsListener,
): Unsubscribe => subscribeInGroups(
  tweetIds,
  (group) => query(tweetsCollection, where(documentId(), 'in', group)),
  toTweets,
  onChange,
);

export const subscribeToRetweets = (
  uids: string[],
  onChange: (retweets: Retweet[]) => void,
): Unsubscribe => subscribeInGroups(
  uids,
  (group) => query(
    interactionsCollection,
    where('type', '==', 'retweet'),
    where('uid', 'in', group),
  ),
  toRetweets,
  onChange,
);

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

const validateDraft = ({ text, media, files }: TweetDraft): string => {
  const content = text.trim();
  const mediaCount = media.length + files.length;

  if (!content && mediaCount === 0) throw new Error('Tweet cannot be empty');
  if (content.length > MAX_TWEET_LENGTH) throw new Error('Tweet cannot exceed 280 characters');
  if (mediaCount > MAX_TWEET_MEDIA) {
    throw new Error(`A tweet can have up to ${MAX_TWEET_MEDIA} photos or videos`);
  }

  files.forEach((file) => {
    const fileError = getFileError(file);
    if (fileError) throw new Error(fileError);
  });

  return content;
};

const uploadTweetMedia = (authorUid: string, files: File[]): Promise<TweetMedia[]> => (
  Promise.all(files.map(async (file) => {
    const id = crypto.randomUUID();
    const url = await uploadFile(`tweets/${authorUid}/${id}-${file.name}`, file);
    const media: TweetMedia = { id, type: isVideoFile(file) ? 'video' : 'image', url };
    return media;
  }))
);

const deleteMediaFiles = async (media: TweetMedia[]): Promise<void> => {
  await Promise.all(media.map((item) => deleteFile(item.url)));
};

export const createTweet = async (
  author: UserSummary | null,
  draft: TweetDraft,
): Promise<void> => {
  const text = validateDraft(draft);
  if (!author) throw new Error('Author not found');

  const media = await uploadTweetMedia(author.uid, draft.files);

  try {
    await addDoc(tweetsCollection, {
      authorUid: author.uid,
      authorFullName: author.fullName,
      authorUsername: author.username,
      contentText: text,
      likesCount: 0,
      retweetsCount: 0,
      createdAt: serverTimestamp(),
      ...(author.photoURL ? { authorPhotoURL: author.photoURL } : {}),
      ...(media.length ? { media } : {}),
    });
  } catch (error) {
    await deleteMediaFiles(media);
    throw error;
  }
};

export const toggleInteraction = async (
  user: UserSummary,
  tweetId: string,
  type: InteractionType,
): Promise<void> => {
  const interactionRef = doc(interactionsCollection, getInteractionId(user.uid, tweetId, type));
  const tweetRef = doc(tweetsCollection, tweetId);

  await runTransaction(FirebaseDB, async (transaction) => {
    const tweetSnapshot = await transaction.get(tweetRef);
    if (!tweetSnapshot.exists()) {
      throw new Error('This tweet no longer exists.');
    }

    const interactionSnapshot = await transaction.get(interactionRef);
    const isActive = interactionSnapshot.exists();

    if (isActive) {
      transaction.delete(interactionRef);
    } else {
      transaction.set(interactionRef, {
        id: interactionRef.id,
        uid: user.uid,
        tweetId,
        type,
        createdAt: serverTimestamp(),
        ...(type === 'retweet' ? { user: toUserSummary(user) } : {}),
      });
    }

    transaction.update(tweetRef, {
      [COUNTER_FIELDS[type]]: increment(isActive ? -1 : 1),
    });
  });
};

export const updateTweet = async (tweet: Tweet, draft: TweetDraft): Promise<void> => {
  const text = validateDraft(draft);
  const uploadedMedia = await uploadTweetMedia(tweet.authorUid, draft.files);
  const media = [...draft.media, ...uploadedMedia];

  try {
    await updateDoc(doc(tweetsCollection, tweet.id), {
      contentText: text,
      media: media.length ? media : deleteField(),
      isEdited: true,
    });
  } catch (error) {
    await deleteMediaFiles(uploadedMedia);
    throw error;
  }

  const keptIds = draft.media.map((item) => item.id);
  const removedMedia = (tweet.media ?? []).filter((item) => !keptIds.includes(item.id));
  await deleteMediaFiles(removedMedia);
};

export const deleteTweet = async (tweetId: string): Promise<void> => {
  const tweetRef = doc(tweetsCollection, tweetId);
  const tweetSnapshot = await getDoc(tweetRef);
  const media = tweetSnapshot.exists()
    ? (tweetSnapshot.data() as TweetDocument).media ?? []
    : [];

  const batch = writeBatch(FirebaseDB);
  const interactions = await getDocs(
    query(interactionsCollection, where('tweetId', '==', tweetId)),
  );

  interactions.docs.forEach((item) => batch.delete(item.ref));
  batch.delete(tweetRef);

  await batch.commit();
  await deleteMediaFiles(media);
};

export const subscribeToAllRetweets = (
  onChange: (retweets: Retweet[]) => void,
): Unsubscribe => onSnapshot(
  query(interactionsCollection, where('type', '==', 'retweet')),
  (snapshot) => onChange(toRetweets(snapshot)),
  () => onChange([]),
);
