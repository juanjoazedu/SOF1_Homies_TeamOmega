import type { UserSummary } from '../types/user.types';
import { UserCard } from './UserCard';

interface UserListProps {
  users: UserSummary[];
  myUid: string;
  followingUids: string[];
  onFollow: (user: UserSummary) => void;
  onUnfollow: (uid: string) => void;
}

export const UserList = ({
  users,
  myUid,
  followingUids,
  onFollow,
  onUnfollow,
}: UserListProps) => (
  <ul className="user-list">
    {users.map((user) => (
      <li key={user.uid}>
        <UserCard
          user={user}
          showFollowButton={user.uid !== myUid}
          isFollowing={followingUids.includes(user.uid)}
          onFollow={() => onFollow(user)}
          onUnfollow={() => onUnfollow(user.uid)}
        />
      </li>
    ))}
  </ul>
);