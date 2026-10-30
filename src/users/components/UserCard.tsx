import type { User } from '../types/user.types';
import { FollowButton } from './FollowButton';

interface UserCardProps {
  user: User;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

export const UserCard = ({ user, isFollowing, onFollow, onUnfollow }: UserCardProps) => {
  return (
    <>
      <article className="user-card">
        {user.photoURL ? (
          <img src={user.photoURL} alt={`Photo of ${user.fullName}`} />
        ) : (
          <div className="user-card__avatar" aria-label={`Photo of ${user.fullName}`}>Without photo</div>
        )}

        <div className="user-card__info">
          <h3>{user.fullName}</h3>
          <p>@{user.username}</p>
        </div>

        <FollowButton
          isFollowing={isFollowing}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
        />
      </article>
    </>
  );
};