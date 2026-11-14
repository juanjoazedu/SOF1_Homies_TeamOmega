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
import type { UserSummary } from '../../users/types/user.types';
import { TweetsContext } from '../contexts/TweetsContext';
import type { TweetView } from '../types/tweet.types';
import { TweetForm } from './TweetForm';

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
  const { editTweet, removeTweet } = useContext(TweetsContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const myUid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';
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
    setIsEditing(true);
  };

  const handleEdit = async (text: string) => {
    setIsSaving(true);

    try {
      await editTweet(tweet.id, text);
      setErrorMessage('');
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not edit the tweet.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAskDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setErrorMessage('');
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsConfirmingDelete(false);
  };

  const handleConfirmDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDeleting(true);

    try {
      await removeTweet(tweet.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not delete the tweet.');
      setIsConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
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
        <img
          className="tweet-card__avatar avatar-placeholder"
          src={avatarIcon}
          alt={tweet.authorFullName}
          referrerPolicy="no-referrer"
        />
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

        {isEditing ? (
          <div onClick={(event) => event.stopPropagation()}>
            <TweetForm
              initialText={tweet.contentText}
              submitLabel="Save"
              submittingLabel="Saving..."
              isSubmitting={isSaving}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <p className="tweet-card__content">{tweet.contentText}</p>
        )}

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

          {isOwner && !isEditing && !isConfirmingDelete && (
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
          <div
            className="tweet-card__confirm"
            role="alert"
            onClick={(event) => event.stopPropagation()}
          >
            <p>Delete this tweet? This cannot be undone.</p>
            <div>
              <button
                type="button"
                className="tweet-card__confirm-cancel"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="tweet-card__confirm-delete"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
        {errorMessage && <p className="tweet-card__error" role="alert">{errorMessage}</p>}
      </div>
    </article>
  );
};