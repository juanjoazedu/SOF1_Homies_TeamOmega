import { useContext } from 'react';
import { AuthContext } from '../../auth/contexts/AuthContext';

import { useFollowList } from '../hooks/useFollowList';
import { usePagination } from '../../shared/hooks/usePagination';

import { UserList } from '../components/UserList';
import { Pagination } from '../../ui/components/Pagination';

export const FollowingPage = () => {
  const { authState } = useContext(AuthContext);
  const uid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const {
    users, followingUids, isLoading, follow, unFollow,
  } = useFollowList(uid, 'following');

  const pagination = usePagination(users);

  return (
    <div className="followers-container">
      <h3>Followers</h3>

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <UserList
          users={pagination.items}
          followingUids={followingUids}
          onFollow={follow}
          onUnfollow={unFollow}
        />
      )}

      <Pagination
        label="Followers pagination"
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        onNext={pagination.nextPage}
        onPrevious={pagination.previousPage}
      />
    </div>
  );
};