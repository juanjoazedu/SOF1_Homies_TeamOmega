import { useEffect, useState } from 'react';

import {
  followUser,
  getFollowers,
  getFollowings,
  getFollowingsUids,
  unfollowUser,
} from '../services/userService';
import type { User } from '../types/user.types';

type FollowListType = 'followers' | 'following';

export const useFollowList = (profileUid: string, myUid: string, type: FollowListType) => {
  const [users, setUsers] = useState<User[]>([]);
  const [followingUids, setFollowingUids] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setUsers(type === 'followers' ? getFollowers(profileUid) : getFollowings(profileUid));
    setFollowingUids(getFollowingsUids(myUid));
    setIsLoading(false);
  }, [profileUid, myUid, type, reloadKey]);

  const reload = () => {
    setReloadKey((key) => key + 1);
  };

  const follow = (targetUid: string) => {
    followUser(myUid, targetUid);
    reload();
  };

  const unfollow = (targetUid: string) => {
    unfollowUser(myUid, targetUid);
    reload();
  };

  return { users, followingUids, isLoading, follow, unfollow };
};