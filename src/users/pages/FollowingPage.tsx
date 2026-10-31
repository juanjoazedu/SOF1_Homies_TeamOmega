import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { usePagination } from '../../shared/hooks/usePagination';
import { Pagination } from '../../ui/components/Pagination';
import { FollowsHeader } from '../components/FollowsHeader';
import { UserList } from '../components/UserList';
import { useFollowList } from '../hooks/useFollowList';
import { useUserProfile } from '../hooks/useUserProfile';

export const FollowingPage = () => {
  const { username = '' } = useParams();
  const { authState } = useContext(AuthContext);
  const myUid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const { profileUser, isLoading: isProfileLoading } = useUserProfile(username, myUid);

  const {
    users,
    followingUids,
    isLoading: isListLoading,
    follow,
    unfollow,
  } = useFollowList(profileUser?.uid ?? '', myUid, 'following');

  const pagination = usePagination(users);

  if (isProfileLoading) {
    return <p>Loading profile...</p>;
  }

  if (!profileUser) {
    return <p>User not found.</p>;
  }

  return (
    <div className="followers-container">
      <FollowsHeader fullName={profileUser.fullName} username={profileUser.username} />

      {isListLoading ? (
        <p>Loading users...</p>
      ) : (
        <UserList
          users={pagination.items}
          myUid={myUid}
          followingUids={followingUids}
          onFollow={follow}
          onUnfollow={unfollow}
        />
      )}

      <Pagination
        label="Following pagination"
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