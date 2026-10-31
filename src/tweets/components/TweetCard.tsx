import type { KeyboardEvent, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { formatDate } from '../../shared/utils/formatDate';
import type { TweetView } from '../types/tweet.types';

interface TweetCardProps {
  tweet: TweetView;
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  isClickable?: boolean;
}

export const TweetCard = ({ tweet, onLike, onRetweet, isClickable = true }: TweetCardProps) => {
  const navigate = useNavigate();
  const profileUrl = `/u/${tweet.authorUsername}`;
  const tweetUrl = `${profileUrl}/tweet/${tweet.id}`;

  const openTweet = () => {
    navigate(tweetUrl);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target === event.currentTarget && event.key === 'Enter') {
      openTweet();
    }
  };

  const handleAction = (
    event: MouseEvent<HTMLButtonElement>,
    action: (tweetId: string) => void,
  ) => {
    event.stopPropagation();
    action(tweet.id);
  };

  const cardClass = isClickable ? 'tweet-card tweet-card--clickable' : 'tweet-card';

  return (
    <article
      className={cardClass}
      role={isClickable ? 'link' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={`Tweet by ${tweet.authorFullName}`}
      onClick={isClickable ? openTweet : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
    >
      <Link
        className="tweet-card__avatar-link"
        to={profileUrl}
        onClick={(event) => event.stopPropagation()}
      >
        {tweet.authorPhotoURL ? (
          <img
            className="tweet-card__avatar"
            src={tweet.authorPhotoURL}
            alt={`Photo of ${tweet.authorFullName}`}
          />
        ) : (
          <div
            className="tweet-card__avatar tweet-card__avatar--empty"
            role="img"
            aria-label={`Photo of ${tweet.authorFullName}`}
          >
            Without photo
          </div>
        )}
      </Link>

      <div className="tweet-card__body">
        <p className="tweet-card__header">
          <Link
            to={profileUrl}
            onClick={(event) => event.stopPropagation()}
          >
            <strong>{tweet.authorFullName}</strong>
          </Link>
          {`, @${tweet.authorUsername} - `}
          <time dateTime={tweet.createdAt.toISOString()}>
            {formatDate(tweet.createdAt)}
          </time>
        </p>

        <p className="tweet-card__content">{tweet.contentText}</p>

        {tweet.media && (
          <div className="tweet-card__media">
            {tweet.media.map((item) => (
              item.type === 'image'
                ? <img key={item.id} src={item.url} alt="Tweet media" />
                : (
                  <video
                    key={item.id}
                    src={item.url}
                    controls
                    onClick={(event) => event.stopPropagation()}
                  />
                )
            ))}
          </div>
        )}

        <div className="tweet-card__actions">
          <button
            type="button"
            aria-pressed={tweet.isLiked}
            onClick={(event) => handleAction(event, onLike)}
          >
            {tweet.isLiked ? 'Liked' : 'Like'} {tweet.likesCount}
          </button>

          <button
            type="button"
            aria-pressed={tweet.isRetweeted}
            onClick={(event) => handleAction(event, onRetweet)}
          >
            {tweet.isRetweeted ? 'Retweeted' : 'Retweet'} {tweet.retweetsCount}
          </button>
        </div>
      </div>
    </article>
  );
};