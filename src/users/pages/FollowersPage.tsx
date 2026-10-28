import { usePagination } from '../../shared/hooks/usePagination';
import { UserList } from '../components/UserList';
import { useUsers } from '../contexts/UserContext';

export const FollowersPage = () => {
  const {
    users,
    follows,
    currentUserUid,
    isLoading,
    error,
    followUser,
    unfollowUser,
  } = useUsers();

  const followerUids = follows
    .filter((follow) => follow.followingUid === currentUserUid)
    .map((follow) => follow.followerUid);

  const followingUids = follows
    .filter((follow) => follow.followerUid === currentUserUid)
    .map((follow) => follow.followingUid);

  const followerUsers = users.filter((user) =>
    followerUids.includes(user.uid)
  );

  const {
    items: currentUsers,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
  } = usePagination(followerUsers);

  return (
    <div className="followers-container">
      <h3>Followers</h3>
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