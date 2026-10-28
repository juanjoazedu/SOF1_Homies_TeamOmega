import type { User } from '../types/user.types';
import { FollowButton } from './FollowButton';

interface UserListProps {
  users: User[];
  followingUids: string[];
  onFollow: (uid: string) => void;
  onUnfollow: (uid: string) => void;
}

export const UserList = ({ users, followingUids, onFollow, onUnfollow }: UserListProps) => {
  
  return (
    <ul className="user-list">
      {users.map((user) => {
        const isFollowing = followingUids.includes(user.uid);

        return (
          <li key={user.uid}>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={`Photo of ${user.fullName}`}
              />
            ) : (
              <div aria-label={`Photo of ${user.fullName}`}>
                Without photo
              </div>
            )}

            <div>
              <h3>{user.fullName}</h3>
              <p>@{user.username}</p>
            </div>

            <FollowButton
              isFollowing={isFollowing}
              onFollow={() => onFollow(user.uid)}
              onUnfollow={() => onUnfollow(user.uid)}
            />
          </li>
        );
      })}
    </ul>
  );
};