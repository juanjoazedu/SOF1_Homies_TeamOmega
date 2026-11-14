import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import homiesLogoMark from '../../assets/homies-logo-mark.svg';
import { AuthContext } from '../../auth/contexts/AuthContext';
import { TweetsContext } from '../../tweets/contexts/TweetsContext';
import { UserCard } from '../../users/components/UserCard';
import { UsersContext } from '../../users/contexts/UsersContext';
import { ConfirmModal } from './ConfirmModal';

export const Header = () => {
  const { authState, logout } = useContext(AuthContext);
  const { currentUser } = useContext(UsersContext);
  const { openComposer } = useContext(TweetsContext);

  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const username = authState.status === 'authenticated' ? authState.sessionUser.username : '';

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      setIsLoggingOut(false);
      setIsConfirmingLogout(false);
    }
  };

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
        <button
          type="button"
          className="app-header__logout"
          onClick={() => setIsConfirmingLogout(true)}
        >
          Logout
        </button>
      </nav>

      <button type="button" className="app-header__post" onClick={openComposer}>
        <span className="app-header__post-label">Post</span>
      </button>

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

      {isConfirmingLogout && (
        <ConfirmModal
          title="Log out of Homies?"
          message="You can always log back in at any time."
          confirmLabel="Log out"
          processingLabel="Logging out..."
          variant="danger"
          isProcessing={isLoggingOut}
          onConfirm={handleConfirmLogout}
          onCancel={() => setIsConfirmingLogout(false)}
        />
      )}
    </header>
  );
};