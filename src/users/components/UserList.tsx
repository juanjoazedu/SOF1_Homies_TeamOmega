import type { User } from '../types/user.types';
import { UserCard } from './UserCard';

interface UserListProps {
  users: User[];
  followingUids: string[];
  onFollow: (uid: string) => void;
  onUnfollow: (uid: string) => void;
}

export const UserList = ({ users, followingUids, onFollow, onUnfollow }: UserListProps) => {
  
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.uid}>
          <UserCard
            user={user}
            isFollowing={followingUids.includes(user.uid)}
            onFollow={() => onFollow(user.uid)}
            onUnfollow={() => onUnfollow(user.uid)}
          />
        </li>
      ))}
    </ul>
  );
};