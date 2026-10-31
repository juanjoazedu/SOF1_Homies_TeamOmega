import { Link } from 'react-router-dom';

import type { User } from '../types/user.types';
import { FollowButton } from './FollowButton';

interface UserCardProps {
  user: User;
  showFollowButton: boolean;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

export const UserCard = ({
  user,
  showFollowButton,
  isFollowing,
  onFollow,
  onUnfollow,
}: UserCardProps) => {
  const profileUrl = `/u/${user.username}`;

  return (
    <article className="user-card">
      <Link className="user-card__avatar-link" to={profileUrl}>
        {user.photoURL ? (
          <img src={user.photoURL} alt={`Photo of ${user.fullName}`} />
        ) : (
          <div
            className="user-card__avatar"
            role="img"
            aria-label={`Photo of ${user.fullName}`}
          >
            Without photo
          </div>
        )}
      </Link>

      <div className="user-card__info">
        <h3>
          <Link to={profileUrl}>{user.fullName}</Link>
        </h3>
        <p>@{user.username}</p>
      </div>

      {showFollowButton && (
        <FollowButton
          isFollowing={isFollowing}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
        />
      )}
    </article>
  );
};