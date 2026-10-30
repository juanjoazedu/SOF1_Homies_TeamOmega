import { Link } from "react-router-dom";

interface FollowCountersProps {
  profileUserName: string;
  followingCount: number;
  followersCount: number;
}

export const FollowCounters = ({
  profileUserName,
  followingCount,
  followersCount,
}: FollowCountersProps) => {
  
  return (
    <nav className="follow-counters">
      <Link to={`/u/${profileUserName}/following`}> {followingCount} Following </Link>
      <Link to={`/u/${profileUserName}/followers`}> {followersCount} Followers</Link>
    </nav>
  );
};