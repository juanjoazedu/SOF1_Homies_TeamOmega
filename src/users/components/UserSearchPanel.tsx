import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
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

  return (
    <section className="user-search" aria-label="Search users">
      <label className="user-search__field" htmlFor="user-search-input">
        <span>Search users</span>
        <input
          id="user-search-input"
          type="search"
          placeholder="Search by @username"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
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
          <UserList
            key={searchTerm}
            users={results}
            myUid={myUid}
            followingUids={followingUids}
            onFollow={follow}
            onUnfollow={unfollow}
            paginationLabel="Users pagination"
            pageSize={PAGE_SIZE}
          />
        )}
      </div>
    </section>
  );
};