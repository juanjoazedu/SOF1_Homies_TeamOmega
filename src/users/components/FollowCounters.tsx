interface FollowCountersProps {
  followersCount: number;
  followingCount: number;
}

export const FollowCounters = ({
  followersCount,
  followingCount,
}: FollowCountersProps) => {
  return (
    <div className="follow-counters">
      <p>Followers: {followersCount}</p>
      <p>Following: {followingCount}</p>
    </div>
  );
};