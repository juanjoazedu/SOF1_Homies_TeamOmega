import { useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';

import calendar from '../../assets/calendar.svg';
import born from '../../assets/born.svg';
import { AuthContext } from '../../auth/contexts/AuthContext';
import { usePagination } from '../../shared/hooks/usePagination';
import { formatMonthYear } from '../../shared/utils/formatDate';
import { TweetList } from '../../tweets/components/TweetList';
import { useTweetList } from '../../tweets/hooks/useTweetList';
import { getTweetsByUid } from '../../tweets/services/tweetService';
import { PageHeader } from '../../ui/components/PageHeader';
import { Pagination } from '../../ui/components/Pagination';
import { FollowButton } from '../components/FollowButton';
import { FollowCounters } from '../components/FollowCounters';
import { UsersContext } from '../contexts/UsersContext';
import { useUserProfile } from '../hooks/useUserProfile';

export const UserProfilePage = () => {
  const { username = '' } = useParams();
  const { authState } = useContext(AuthContext);
  const myUid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';
  const { followingUids, follow, unfollow } = useContext(UsersContext);

  const {
    profileUser,
    followersCount,
    followingCount,
    isLoading,
  } = useUserProfile(username);

  const profileUid = profileUser?.uid;
  const loadProfileTweets = useCallback(
    () => (profileUid ? getTweetsByUid(profileUid, myUid) : []),
    [profileUid, myUid],
  );
  const { tweets, like, retweet } = useTweetList(loadProfileTweets, myUid);
  const pagination = usePagination(tweets);

  if (isLoading) {
    return (
      <div className="profile-container">
        <PageHeader title="Profile" backTo="/" />
        <p className="page-status">Loading profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-container">
        <PageHeader title="Profile" backTo="/" />
        <p className="page-status">User not found.</p>
      </div>
    );
  }

  const isOwnProfile = profileUser.uid === myUid;

  return (
    <div className="profile-container">
      <PageHeader title={profileUser.fullName} backTo="/" />
      <header className="profile-header">
        <div>
          <img src={profileUser.photoURL} alt={profileUser.fullName} />
          <h2>{profileUser.fullName}</h2>
          <p>@{profileUser.username}</p>
          <p>{profileUser.bio}</p>
          {profileUser.dateOfBirth && (
            <p>
              <img className="svg-icon" src={born} alt="" />
              Born on {formatMonthYear(profileUser.dateOfBirth)}
            </p>
          )}
          <p>
            <img className="svg-icon" src={calendar} alt="" />
            Joined {formatMonthYear(profileUser.dateOfRegistration)}
          </p>
        </div>

        {!isOwnProfile && (
          <div className="follow-button-container">
            <FollowButton
              isFollowing={followingUids.includes(profileUser.uid)}
              onFollow={() => follow(profileUser)}
              onUnfollow={() => unfollow(profileUser.uid)}
            />
          </div>
        )}
      </header>

      <FollowCounters
        profileUserName={profileUser.username}
        followingCount={followingCount}
        followersCount={followersCount}
      />

      <TweetList
        tweets={pagination.items}
        onLike={like}
        onRetweet={retweet}
        emptyMessage={`@${profileUser.username} hasn't tweeted yet.`}
      />

      {tweets.length > 0 && (
        <Pagination
          label="Tweets pagination"
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onNext={pagination.nextPage}
          onPrevious={pagination.previousPage}
        />
      )}
    </div>
  );
};