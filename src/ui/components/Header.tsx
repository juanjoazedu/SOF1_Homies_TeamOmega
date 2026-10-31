import { useUserProfile } from "../../users/hooks/useUserProfile";
import { useContext } from "react";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { UserCard } from "../../users/components/UserCard";

import homiesLogoMark from "../../assets/homies-logo-mark.svg";
import { Link } from "react-router-dom";

export const Header = () => {
  const { authState } = useContext(AuthContext);
  const myUid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';
  const username = authState.status === 'authenticated' ? authState.sessionUser.username : '';
  
  const { profileUser, isLoading } = useUserProfile(username, myUid);
  
  if (isLoading) {
    return (
      <header className="app-header">
        <p>Loading Home Page...</p>
      </header>
    );
  }

  if (!profileUser) {
    return <header className="app-header" />;
  }

  return (
    <header className="app-header">
      <Link className="app-header__logo" to="/" aria-label="Home">
        <img src={homiesLogoMark} alt="Homies Logo" />
      </Link>

      <nav className="app-header__nav" aria-label="Main navigation">
        <Link className="app-header__link" to="/">
          <span className="app-header__label">Home</span>
        </Link>
        <Link className="app-header__link" to={`/u/${profileUser.username}`}>
          <span className="app-header__label">Profile</span>
        </Link>
      </nav>

      <Link className="app-header__post" to="/compose">
        <span className="app-header__post-label">Post</span>
      </Link>

      <div className="app-header__user">
        <UserCard
          user={profileUser}
          showFollowButton={false}
          isFollowing={false}
          onFollow={() => {}}
          onUnfollow={() => {}}
        />
      </div>
    </header>
  )
};