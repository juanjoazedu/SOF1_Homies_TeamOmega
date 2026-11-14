import type { FeedItem } from '../types/tweet.types';
import { TweetCard } from './TweetCard';

interface TweetListProps {
  items: FeedItem[];
  onLike: (tweetId: string) => Promise<void>;
  onRetweet: (tweetId: string) => Promise<void>;
  emptyMessage?: string;
}

export const TweetList = ({
  items,
  onLike,
  onRetweet,
  emptyMessage = 'There are no tweets yet.',
}: TweetListProps) => {
  if (items.length === 0) {
    return <p className="tweet-list__empty">{emptyMessage}</p>;
  }

  return (
    <ul className="tweet-list">
      {items.map((item) => (
        <li key={item.key}>
          <TweetCard
            tweet={item.tweet}
            retweetedBy={item.retweetedBy}
            onLike={onLike}
            onRetweet={onRetweet}
          />
        </li>
      ))}
    </ul>
  );
};