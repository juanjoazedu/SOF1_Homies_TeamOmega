import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { usePagination } from '../../shared/hooks/usePagination';
import { formatMonthYear } from '../../shared/utils/formatDate';
//import { TweetList } from '../../tweets/components/TweetList';
import { Pagination } from '../../ui/components/Pagination';
import { FollowButton } from '../components/FollowButton';
import { FollowCounters } from '../components/FollowCounters';
import { useUserProfile } from '../hooks/useUserProfile';

export const UserProfilePage = () => {
  const { username = '' } = useParams();
  const { authState } = useContext(AuthContext);
  const myUid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const {
    profileUser, followersCount, followingCount, isFollowing, tweets, isLoading, follow, unfollow,
  } = useUserProfile(username, myUid);

  const pagination = usePagination(tweets);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (!profileUser) {
    return <p>User not found.</p>;
  }

  const isOwnProfile = profileUser.uid === myUid;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div>
          <img src={profileUser.photoURL} alt={`Profile photo of ${profileUser.fullName}`} />
          <h2>{profileUser.fullName}</h2>
          <p>@{profileUser.username}</p>
          <p>{profileUser.bio}</p>
          <p>Born on {formatMonthYear(profileUser.dateOfBirth)}</p>
          <p>Joined {formatMonthYear(profileUser.dateOfRegistration)}</p>
        </div>

        {!isOwnProfile && (
          <div className="follow-button-container">
            <FollowButton 
              isFollowing={isFollowing}
              onFollow={follow}
              onUnfollow={unfollow}
            />

          </div>
        )}
      </header>

      <FollowCounters
        profileUserName={profileUser.username}
        followingCount={followingCount}
        followersCount={followersCount}
      />

      {/* <TweetList tweets={pagination.items} /> */}

      <Pagination
        label="Tweets pagination"
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