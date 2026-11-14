import type { Timestamp } from 'firebase/firestore';

import type { UserSummary } from '../../users/types/user.types';

export type MediaType = 'image' | 'video';

export interface TweetMedia {
  id: string;
  type: MediaType;
  url: string;
}

export interface TweetDraft {
  text: string;
  media: TweetMedia[];
  files: File[];
}

export interface Tweet {
  id: string;
  authorUid: string;
  authorFullName: string;
  authorUsername: string;
  authorPhotoURL?: string;
  contentText: string;
  media?: TweetMedia[];
  likesCount: number;
  retweetsCount: number;
  createdAt: Date;
  isEdited?: boolean;
}

export interface TweetView extends Tweet {
  isLiked: boolean;
  isRetweeted: boolean;
}

export type InteractionType = 'like' | 'retweet';

export interface TweetInteraction {
  id: string;
  uid: string;
  tweetId: string;
  type: InteractionType;
  user?: UserSummary;
}

export type InteractionDocument = TweetInteraction & { createdAt?: Timestamp };

export interface Retweet {
  tweetId: string;
  user: UserSummary;
  createdAt: Date;
}

export interface FeedItem {
  key: string;
  tweet: TweetView;
  retweetedBy?: UserSummary;
  activityAt: Date;
}

export type TweetDocument = Omit<Tweet, 'id' | 'createdAt'> & { createdAt: Timestamp };

export interface TweetsContextValue {
  likedTweetIds: string[];
  retweetedTweetIds: string[];
  toggleLike: (tweetId: string) => Promise<void>;
  toggleRetweet: (tweetId: string) => Promise<void>;
  removeTweet: (tweetId: string) => Promise<void>;
  openComposer: () => void;
  openEditor: (tweet: Tweet) => void;
}
