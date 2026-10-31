import { getFollowingsUids, getUserByUid } from '../../users/services/userService';
import { mockTweets } from '../data/mockTweet';
import type {
  InteractionType,
  Tweet,
  TweetInteraction,
  TweetMedia,
  TweetView,
} from '../types/tweet.types';

const MAX_TWEET_LENGTH = 280;

type CounterField = 'likesCount' | 'retweetsCount';

let tweets: Tweet[] = [...mockTweets];
let interactions: TweetInteraction[] = [];

const findTweet = (tweetId: string): Tweet | undefined => (
  tweets.find((tweet) => tweet.id === tweetId)
);

const interactionId = (uid: string, tweetId: string, type: InteractionType): string => (
  `${uid}_${tweetId}_${type}`
);

const hasInteraction = (uid: string, tweetId: string, type: InteractionType): boolean => {
  const id = interactionId(uid, tweetId, type);
  return interactions.find((item) => item.id === id) !== undefined;
};

const sortByNewest = (list: Tweet[]): Tweet[] => [...list].sort(
  (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
);

const toView = (tweet: Tweet, uid: string): TweetView => ({
  ...tweet,
  isLiked: hasInteraction(uid, tweet.id, 'like'),
  isRetweeted: hasInteraction(uid, tweet.id, 'retweet'),
});

const toggleInteraction = (uid: string, tweetId: string, type: InteractionType): boolean => {
  const id = interactionId(uid, tweetId, type);

  if (hasInteraction(uid, tweetId, type)) {
    interactions = interactions.filter((item) => item.id !== id);
    return false;
  }

  interactions = [...interactions, {
    id,
    uid,
    tweetId,
    type,
  }];
  return true;
};

const changeCount = (tweetId: string, field: CounterField, amount: number): void => {
  tweets = tweets.map((tweet) => (tweet.id === tweetId ? { ...tweet, [field]: tweet[field] + amount } : tweet));
};

const generateTweetId = (): string => crypto.randomUUID();

export const getTweetsForYou = (uid: string): TweetView[] => (
  sortByNewest(tweets).map((tweet) => toView(tweet, uid))
);

export const getFollowingTweets = (uid: string): TweetView[] => {
  const authorUids = [uid, ...getFollowingsUids(uid)];
  const feedTweets = tweets.filter((tweet) => authorUids.includes(tweet.authorUid));
  return sortByNewest(feedTweets).map((tweet) => toView(tweet, uid));
};

export const getTweetsByUid = (authorUid: string, viewerUid: string): TweetView[] => {
  const userTweets = tweets.filter((tweet) => tweet.authorUid === authorUid);
  return sortByNewest(userTweets).map((tweet) => toView(tweet, viewerUid));
};

export const getTweetById = (tweetId: string, uid: string): TweetView | null => {
  const tweet = findTweet(tweetId);
  return tweet ? toView(tweet, uid) : null;
};

export const createTweet = (authorUid: string,contentText: string,media?: TweetMedia[]): Tweet => {
  const text = contentText.trim();
  if (!text) throw new Error('Tweet cannot be empty');
  if (text.length > MAX_TWEET_LENGTH) throw new Error('Tweet cannot exceed 280 characters');

  const author = getUserByUid(authorUid);
  if (!author) throw new Error('Author not found');

  const newTweet: Tweet = {
    id: generateTweetId(),
    authorUid: author.uid,
    authorFullName: author.fullName,
    authorUsername: author.username,
    authorPhotoURL: author.photoURL,
    contentText: text,
    media,
    likesCount: 0,
    retweetsCount: 0,
    createdAt: new Date(),
  };

  tweets = [newTweet, ...tweets];
  return newTweet;
};

export const deleteTweet = (tweetId: string, uid: string): void => {
  const tweet = findTweet(tweetId);
  if (!tweet || tweet.authorUid !== uid) return;

  tweets = tweets.filter((item) => item.id !== tweetId);
  interactions = interactions.filter((item) => item.tweetId !== tweetId);
};

export const toggleLike = (uid: string, tweetId: string): void => {
  if (!findTweet(tweetId)) return;

  const added = toggleInteraction(uid, tweetId, 'like');
  changeCount(tweetId, 'likesCount', added ? 1 : -1);
};

export const toggleRetweet = (uid: string, tweetId: string): void => {
  if (!findTweet(tweetId)) return;

  const added = toggleInteraction(uid, tweetId, 'retweet');
  changeCount(tweetId, 'retweetsCount', added ? 1 : -1);
};