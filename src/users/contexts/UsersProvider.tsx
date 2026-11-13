import {
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import {
  followUser,
  subscribeToFollowing,
  subscribeToUser,
  unfollowUser,
} from '../services/userService';
import type { User, UserSummary } from '../types/user.types';
import { UsersContext } from './UsersContext';

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider = ({ children }: UsersProviderProps) => {
  const { authState } = useContext(AuthContext);
  const uid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [followingUids, setFollowingUids] = useState<string[]>([]);

  useEffect(() => {
    if (!uid) return undefined;

    const unsubscribeUser = subscribeToUser(uid, setCurrentUser);
    const unsubscribeFollowing = subscribeToFollowing(uid, (users) => {
      setFollowingUids(users.map((user) => user.uid));
    });

    return () => {
      unsubscribeUser();
      unsubscribeFollowing();
    };
  }, [uid]);

  const follow = async (target: UserSummary) => {
    if (!currentUser) return;
    await followUser(currentUser, target);
  };

  const unfollow = async (targetUid: string) => {
    await unfollowUser(uid, targetUid);
  };

  return (
    <UsersContext.Provider value={{
      currentUser,
      followingUids,
      follow,
      unfollow,
    }}
    >
      {children}
    </UsersContext.Provider>
  );
};