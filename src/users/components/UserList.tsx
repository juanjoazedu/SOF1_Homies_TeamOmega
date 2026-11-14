import { usePagination } from '../../shared/hooks/usePagination';
import { Pagination } from '../../ui/components/Pagination';
import type { UserSummary } from '../types/user.types';
import { UserCard } from './UserCard';

interface UserListProps {
  users: UserSummary[];
  myUid: string;
  followingUids: string[];
  onFollow: (user: UserSummary) => void;
  onUnfollow: (uid: string) => void;
  paginationLabel: string;
  pageSize?: number;
}

export const UserList = ({
  users,
  myUid,
  followingUids,
  onFollow,
  onUnfollow,
  paginationLabel,
  pageSize,
}: UserListProps) => {
  const pagination = usePagination(users, pageSize);

  return (
    <>
      <ul className="user-list">
        {pagination.items.map((user) => (
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

      <Pagination
        label={paginationLabel}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        onNext={pagination.nextPage}
        onPrevious={pagination.previousPage}
      />
    </>
  );
};