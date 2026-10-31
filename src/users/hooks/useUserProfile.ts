import { useEffect, useState } from 'react';
import type { User } from '../types/user.types';
import { followUser, getFollowers, getFollowings, getFollowingsUids, unfollowUser } from '../services/userService';
import { getUserByUsername } from '../services/userService';

export const useUserProfile = (username: string, myUid: string) => {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tweets, setTweets] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);


  useEffect(() => {
    const user = getUserByUsername(username);
    if (user) {
        setProfileUser(user);
        setFollowersCount(getFollowers(user.uid).length);
        setFollowingCount(getFollowings(user.uid).length);
        setIsFollowing(getFollowingsUids(myUid).includes(user.uid));
        //setTweets(getUserTweets(user.uid));
    }
    setIsLoading(false);
  }, [username, myUid, reloadKey]);

  const follow = () => {
    if (!profileUser) {
        return;
    }
    followUser(myUid, profileUser.uid);
    setReloadKey((key) => key + 1);
  };

  const unfollow = () => {
    if (!profileUser) {
        return;
    }
    unfollowUser(myUid, profileUser.uid);
    setReloadKey((key) => key + 1);
  };

  return { profileUser, followersCount, followingCount, isFollowing, tweets, isLoading, follow, unfollow };
};