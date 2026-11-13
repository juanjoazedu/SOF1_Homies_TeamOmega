import {
  useContext,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { formatDate } from '../../shared/utils/formatDate';
import { TweetsContext } from '../contexts/TweetsContext';
import type { TweetView } from '../types/tweet.types';
import { TweetForm } from './TweetForm';

interface TweetCardProps {
  tweet: TweetView;
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  isClickable?: boolean;
}

export const TweetCard = ({ tweet, onLike, onRetweet, isClickable = true }: TweetCardProps) => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const { editTweet, removeTweet } = useContext(TweetsContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isOwner = authState.status === 'authenticated'
    && authState.sessionUser.uid === tweet.authorUid;

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

          {isOwner && !isEditing && !isConfirmingDelete && (
            <>
              <button type="button" onClick={handleStartEdit}>Edit</button>
              <button type="button" className="tweet-card__delete" onClick={handleAskDelete}>
                Delete
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