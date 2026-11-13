import { Link } from 'react-router-dom';

interface FollowCountersProps {
  profileUserName: string;
  followingCount: number;
  followersCount: number;
}

export const FollowCounters = ({
  profileUserName,
  followingCount,
  followersCount,
}: FollowCountersProps) => (
  <nav className="follow-counters">
    <div>
      <Link to={`/u/${profileUserName}/following`}>
        <strong>{followingCount}</strong>
        {' Following'}
      </Link>
      <Link to={`/u/${profileUserName}/followers`}>
        <strong>{followersCount}</strong>
        {' Followers'}
      </Link>
    </div>
  </nav>
);