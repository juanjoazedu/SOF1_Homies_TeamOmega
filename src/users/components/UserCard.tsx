import { Link } from 'react-router-dom';

import type { UserSummary } from '../types/user.types';
import { FollowButton } from './FollowButton';

import avatarIcon from '../../assets/avatar.svg';

interface UserCardProps {
  user: UserSummary;
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
          <img src={user.photoURL} alt={user.fullName} referrerPolicy="no-referrer" />
        ) : (
          <img className="avatar-placeholder" src={avatarIcon} alt={user.fullName} />
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