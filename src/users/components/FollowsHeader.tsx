import { Link, NavLink } from 'react-router-dom';
import arrowLeft from '../../assets/arrow-left.svg';

interface FollowsHeaderProps {
  fullName: string;
  username: string;
}

const getTabClass = ({ isActive }: { isActive: boolean }): string => (
  isActive ? 'follows-tab active' : 'follows-tab'
);

export const FollowsHeader = ({ fullName, username }: FollowsHeaderProps) => (
  <div className="follows-header">
    <div className="follows-header__top">
      <Link to={`/u/${username}`} className="follows-header__back" aria-label="Back">
        <img src={arrowLeft} alt="" />
      </Link>
      <div>
        <h2>{fullName}</h2>
        <p>@{username}</p>
      </div>
    </div>

    <nav className="follows-tabs">
      <NavLink to={`/u/${username}/following`} className={getTabClass}>
        Following
      </NavLink>
      <NavLink to={`/u/${username}/followers`} className={getTabClass}>
        Followers
      </NavLink>
    </nav>
  </div>
);