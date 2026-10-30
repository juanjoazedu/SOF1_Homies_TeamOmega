import { useEffect, useState } from 'react';
import type { User } from '../types/user.types';
import { getFollowers, getFollowings, getFollowingsUids, followUser, unfollowUser } from '../services/userService';
type FollowListType = 'followers' | 'following';

export const useFollowList = (uid: string, type: FollowListType) => {
  const [users, setUsers] = useState<User[]>([]);
  const [followingUids, setFollowingUids] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setUsers(type === 'followers' ? getFollowers(uid) : getFollowings(uid));
    setFollowingUids(getFollowingsUids(uid));
    setIsLoading(false);
  }, [uid, type, reloadKey]);

  const follow = (targetUid: string) => {
    followUser(uid, targetUid);
    setReloadKey((key) => key + 1);
  };

  const unFollow = (targetUid: string) => {
    unfollowUser(uid, targetUid);
    setReloadKey((key) => key + 1);
  };

  return { users, followingUids, isLoading, follow, unFollow };
};