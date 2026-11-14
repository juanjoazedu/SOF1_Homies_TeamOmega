import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../auth/contexts/AuthContext';
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
        key={type}
        users={type === 'followers' ? followers : following}
        myUid={myUid}
        followingUids={followingUids}
        onFollow={follow}
        onUnfollow={unfollow}
        paginationLabel={type === 'followers' ? 'Followers pagination' : 'Following pagination'}
      />
    </div>
  );
};