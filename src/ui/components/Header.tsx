import { useContext } from 'react';
import { Link } from 'react-router-dom';

import homiesLogoMark from '../../assets/homies-logo-mark.svg';
import { AuthContext } from '../../auth/contexts/AuthContext';
import { UserCard } from '../../users/components/UserCard';
import { UsersContext } from '../../users/contexts/UsersContext';

export const Header = () => {
  const { authState, logout } = useContext(AuthContext);
  const { currentUser } = useContext(UsersContext);
  const username = authState.status === 'authenticated' ? authState.sessionUser.username : '';

  return (
    <header className="app-header">
      <Link className="app-header__logo" to="/" aria-label="Home">
        <img src={homiesLogoMark} alt="" />
      </Link>

      <nav className="app-header__nav" aria-label="Main navigation">
        <Link className="app-header__link" to="/">
          <span className="app-header__label">Home</span>
        </Link>
        <Link className="app-header__link" to={`/u/${username}`}>
          <span className="app-header__label">Profile</span>
        </Link>
        <button type="button" className="app-header__logout" onClick={logout}>
          Logout
        </button>
      </nav>

      <Link className="app-header__post" to="/compose">
        <span className="app-header__post-label">Post</span>
      </Link>

      {currentUser && (
        <div className="app-header__user">
          <UserCard
            user={currentUser}
            showFollowButton={false}
            isFollowing={false}
            onFollow={() => {}}
            onUnfollow={() => {}}
          />
        </div>
      )}
    </header>
  );
};