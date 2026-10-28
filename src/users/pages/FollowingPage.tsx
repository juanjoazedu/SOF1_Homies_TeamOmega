import { UserList } from '../components/UserList';
import { usePagination } from '../../shared/hooks/usePagination';
import { useUsers } from '../contexts/UserContext';

const CURRENT_USER_UID = 'u1';

export const FollowingPage = () => {
  const {
    users,
    follows,
    isLoading,
    error,
    followUser,
    unfollowUser,
  } = useUsers();

  const followingUids = follows
    .filter((follow) => follow.followerUid === CURRENT_USER_UID)
    .map((follow) => follow.followingUid);

  const followingUsers = users.filter((user) =>
    followingUids.includes(user.uid)
  );

  const {
    items: currentUsers,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
  } = usePagination(followingUsers);

  return (
    <div className="followers-container">
      <h3>Following</h3>
      {error && <p role="alert">{error}</p>}

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <UserList
          users={currentUsers}
          followingUids={followingUids}
          onFollow={followUser}
          onUnfollow={unfollowUser}
        />
      )}

      <div className="pagination" aria-label="Followers pagination">
        <button
          type="button"
          onClick={previousPage}
          disabled={!hasPreviousPage}
        >
          {"<"}
        </button>

        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={nextPage}
          disabled={!hasNextPage}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};