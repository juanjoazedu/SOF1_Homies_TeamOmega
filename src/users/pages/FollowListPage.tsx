import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { usePagination } from '../../shared/hooks/usePagination';
import { Pagination } from '../../ui/components/Pagination';
import { FollowsHeader } from '../components/FollowsHeader';
import { UserList } from '../components/UserList';
import { UsersContext } from '../contexts/UsersContext';
import { useUserProfile } from '../hooks/useUserProfile';

interface FollowListPageProps {
  type: 'followers' | 'following';
}

export const FollowListPage = ({ type }: FollowListPageProps) => {
  const { username = '' } = useParams();
  const { authState } = useContext(AuthContext);
  const myUid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';
  const { followingUids, follow, unfollow } = useContext(UsersContext);

  const {
    profileUser,
    followers,
    following,
    isLoading,
  } = useUserProfile(username);
  const pagination = usePagination(type === 'followers' ? followers : following);

  if (isLoading || !profileUser) {
    return (
      <div className="followers-container">
        <p className="page-status">{isLoading ? 'Loading profile...' : 'User not found.'}</p>
      </div>
    );
  }

  return (
    <div className="followers-container">
      <FollowsHeader fullName={profileUser.fullName} username={profileUser.username} />

      <UserList
        users={pagination.items}
        myUid={myUid}
        followingUids={followingUids}
        onFollow={follow}
        onUnfollow={unfollow}
      />

      <Pagination
        label={type === 'followers' ? 'Followers pagination' : 'Following pagination'}
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