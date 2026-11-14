import { useEffect, useState } from 'react';
import type { Unsubscribe } from 'firebase/firestore';

import {
  getUidByUsername,
  subscribeToFollowers,
  subscribeToFollowing,
  subscribeToUser,
} from '../services/userService';
import type { User, UserSummary } from '../types/user.types';

export const useUserProfile = (username: string) => {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<UserSummary[]>([]);
  const [following, setFollowing] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    let unsubscribers: Unsubscribe[] = [];

    setIsLoading(true);
    setFollowers([]);
    setFollowing([]);

    const finishWithoutUser = () => {
      setProfileUser(null);
      setIsLoading(false);
    };

    getUidByUsername(username)
      .then((uid) => {
        if (!isActive) return;

        if (!uid) {
          finishWithoutUser();
          return;
        }

        unsubscribers = [
          subscribeToUser(uid, (user) => {
            setProfileUser(user);
            setIsLoading(false);
          }),
          subscribeToFollowers(uid, setFollowers),
          subscribeToFollowing(uid, setFollowing),
        ];
      })
      .catch(() => {
        if (isActive) finishWithoutUser();
      });

    return () => {
      isActive = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [username]);

  return {
    profileUser,
    followers,
    following,
    followersCount: followers.length,
    followingCount: following.length,
    isLoading,
  };
};