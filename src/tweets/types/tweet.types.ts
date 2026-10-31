export type MediaType = 'image' | 'video';

export interface TweetMedia {
  id: string;
  type: MediaType;
  url: string;
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
}