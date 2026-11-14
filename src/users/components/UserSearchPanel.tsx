import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { usePagination } from '../../shared/hooks/usePagination';
import { Pagination } from '../../ui/components/Pagination';
import { UsersContext } from '../contexts/UsersContext';
import { useAllUsers } from '../hooks/useAllUsers';
import { UserList } from './UserList';

const SEARCH_DELAY = 500;
const PAGE_SIZE = 6;

export const UserSearchPanel = () => {
  const { authState } = useContext(AuthContext);
  const myUid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';
  const { followingUids, follow, unfollow } = useContext(UsersContext);
  const { users, isLoading } = useAllUsers();

  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search.trim().replace(/^@/, '').toLowerCase());
    }, SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [search]);

  const results = users.filter((user) => (
    user.uid !== myUid && user.username.toLowerCase().startsWith(searchTerm)
  ));
  const pagination = usePagination(results, PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    pagination.goToPage(1);
  };

  return (
    <section className="user-search" aria-label="Search users">
      <label className="user-search__field" htmlFor="user-search-input">
        <span>Search users</span>
        <input
          id="user-search-input"
          type="search"
          placeholder="Search by @username"
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          autoComplete="off"
        />
      </label>

      <div className="user-search__results">
        <h2>Users</h2>

        {isLoading && <p className="page-status">Loading users...</p>}

        {!isLoading && results.length === 0 && (
          <p className="page-status">No users found.</p>
        )}

        {results.length > 0 && (
          <>
            <UserList
              users={pagination.items}
              myUid={myUid}
              followingUids={followingUids}
              onFollow={follow}
              onUnfollow={unfollow}
            />

            <Pagination
              label="Users pagination"
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              onNext={pagination.nextPage}
              onPrevious={pagination.previousPage}
            />
          </>
        )}
      </div>
    </section>
  );
};