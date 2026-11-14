import {
  useContext,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import avatarIcon from '../../assets/avatar.svg';
import { AuthContext } from '../../auth/contexts/AuthContext';
import { formatDate } from '../../shared/utils/formatDate';
import { ConfirmModal } from '../../ui/components/ConfirmModal';
import type { UserSummary } from '../../users/types/user.types';
import { TweetsContext } from '../contexts/TweetsContext';
import type { TweetView } from '../types/tweet.types';

interface TweetCardProps {
  tweet: TweetView;
  retweetedBy?: UserSummary;
  onLike: (tweetId: string) => Promise<void>;
  onRetweet: (tweetId: string) => Promise<void>;
  isClickable?: boolean;
}

export const TweetCard = ({
  tweet,
  retweetedBy,
  onLike,
  onRetweet,
  isClickable = true,
}: TweetCardProps) => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const { removeTweet, openEditor } = useContext(TweetsContext);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasPhotoError, setHasPhotoError] = useState(false);

  const myUid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';
  const hasPhoto = Boolean(tweet.authorPhotoURL) && !hasPhotoError;
  const isOwner = myUid === tweet.authorUid;
  const retweeterName = retweetedBy?.uid === myUid ? 'You' : retweetedBy?.fullName;

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

  const handleAction = async (
    event: MouseEvent<HTMLButtonElement>,
    action: (tweetId: string) => Promise<void>,
  ) => {
    event.stopPropagation();
    setErrorMessage('');

    try {
      await action(tweet.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not update the tweet.');
    }
  };

  const handleStartEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setErrorMessage('');
    openEditor(tweet);
  };

  const handleAskDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setErrorMessage('');
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      await removeTweet(tweet.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not delete the tweet.');
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
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
        {hasPhoto ? (
          <img
            className="tweet-card__avatar"
            src={tweet.authorPhotoURL}
            alt={tweet.authorFullName}
            referrerPolicy="no-referrer"
            onError={() => setHasPhotoError(true)}
          />
        ) : (
          <img
            className="tweet-card__avatar avatar-placeholder"
            src={avatarIcon}
            alt={tweet.authorFullName}
          />
        )}
      </Link>

      <div className="tweet-card__body">
        {retweetedBy && (
          <p className="tweet-card__retweeted-by">
            <span className="tweet-icon tweet-icon--retweet" aria-hidden="true" />
            <Link
              to={`/u/${retweetedBy.username}`}
              onClick={(event) => event.stopPropagation()}
            >
              {`${retweeterName} reposted`}
            </Link>
          </p>
        )}

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
          {tweet.isEdited && ' (edited)'}
        </p>

        <p className="tweet-card__content">{tweet.contentText}</p>

        {tweet.media && (
          <div className="tweet-card__media">
            {tweet.media.map((item) => (
              item.type === 'image'
                ? <img key={item.id} src={item.url} alt="" />
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
            aria-label={`${tweet.isLiked ? 'Unlike' : 'Like'}, ${tweet.likesCount} likes`}
            onClick={(event) => handleAction(event, onLike)}
          >
            <span className="tweet-icon tweet-icon--heart" aria-hidden="true" />
            {tweet.likesCount}
          </button>

          <button
            type="button"
            aria-pressed={tweet.isRetweeted}
            aria-label={`${tweet.isRetweeted ? 'Undo retweet' : 'Retweet'}, ${tweet.retweetsCount} retweets`}
            onClick={(event) => handleAction(event, onRetweet)}
          >
            <span className="tweet-icon tweet-icon--retweet" aria-hidden="true" />
            {tweet.retweetsCount}
          </button>

          {isOwner && (
            <>
              <button type="button" aria-label="Edit tweet" onClick={handleStartEdit}>
                <span className="tweet-icon tweet-icon--edit" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="tweet-card__delete"
                aria-label="Delete tweet"
                onClick={handleAskDelete}
              >
                <span className="tweet-icon tweet-icon--trash" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {isConfirmingDelete && (
          <ConfirmModal
            title="Delete tweet?"
            message="This can't be undone and it will be removed from your profile and from the feed of the people who follow you."
            confirmLabel="Delete"
            processingLabel="Deleting..."
            variant="danger"
            isProcessing={isDeleting}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
        {errorMessage && <p className="tweet-card__error" role="alert">{errorMessage}</p>}
      </div>
    </article>
  );
};