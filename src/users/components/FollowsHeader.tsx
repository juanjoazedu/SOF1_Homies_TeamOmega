import { Link, NavLink } from 'react-router-dom';
import arrowLeft from '../../assets/arrow-left.svg';

interface FollowsHeaderProps {
  fullName: string;
  username: string;
}

export const FollowsHeader = ({ fullName, username }: FollowsHeaderProps) => {
  return (
    <div className="follows-header">
      <div className="follows-header__top">
        <Link to={`/u/${username}`} className="follows-header__back" aria-label="Go back">
            <img src={arrowLeft} alt="Back arrow" />
        </Link>
        <div>
          <h2>{fullName}</h2>
          <p>@{username}</p>
        </div>
      </div>

      <nav className="follows-tabs">
        <NavLink 
          to={`/u/${username}/following`}
          className={({ isActive }) => isActive ? 'follows-tab active' : 'follows-tab'}
        >
          Following
        </NavLink>
        <NavLink 
          to={`/u/${username}/followers`}
          className={({ isActive }) => isActive ? 'follows-tab active' : 'follows-tab'}
        >
          Followers
        </NavLink>
      </nav>
    </div>
  );
};