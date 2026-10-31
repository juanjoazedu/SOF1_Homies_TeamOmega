import type { TweetView } from '../types/tweet.types';
import { TweetCard } from './TweetCard';

interface TweetListProps {
  tweets: TweetView[];
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  emptyMessage?: string;
}

export const TweetList = ({
  tweets,
  onLike,
  onRetweet,
  emptyMessage = 'There are no tweets yet.',
}: TweetListProps) => {
  if (tweets.length === 0) {
    return <p className="tweet-list__empty">{emptyMessage}</p>;
  }

  return (
    <ul className="tweet-list">
      {tweets.map((tweet) => (
        <li key={tweet.id}>
          <TweetCard tweet={tweet} onLike={onLike} onRetweet={onRetweet} />
        </li>
      ))}
    </ul>
  );
};