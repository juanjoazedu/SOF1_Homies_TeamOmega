import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { AuthContext } from '../../auth/contexts/AuthContext';
import { userService } from '../services/userService';
import type { Follow, User } from '../types/user.types';

interface UserContextValue {
  users: User[];
  follows: Follow[];
  currentUserUid: string | null;
  isLoading: boolean;
  error: string | null;
  followUser: (uid: string) => Promise<void>;
  unfollowUser: (uid: string) => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { authState } = useContext(AuthContext);
  const currentUserUid =
    authState.status === 'authenticated' ? authState.sessionUser.uid : null;
  const [users, setUsers] = useState<User[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshFollows = useCallback(async () => {
    const loadedFollows = await userService.getFollows();
    setFollows(loadedFollows);
  }, []);

  useEffect(() => {
    if (!currentUserUid) {
      setUsers([]);
      setFollows([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const loadUserData = async () => {
      try {
        const [loadedUsers, loadedFollows] = await Promise.all([
          userService.getUsers(),
          userService.getFollows(),
        ]);
        setUsers(loadedUsers);
        setFollows(loadedFollows);
      } catch {
        setError('Unable to load users.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadUserData();
  }, [currentUserUid]);

  const followUser = async (uid: string) => {
    if (!currentUserUid) {
      setError('You must be authenticated to follow a user.');
      return;
    }

    try {
      setError(null);
      await userService.followUser(currentUserUid, uid);
      await refreshFollows();
    } catch {
      setError('Unable to follow this user.');
    }
  };

  const unfollowUser = async (uid: string) => {
    if (!currentUserUid) {
      setError('You must be authenticated to unfollow a user.');
      return;
    }

    try {
      setError(null);
      await userService.unfollowUser(currentUserUid, uid);
      await refreshFollows();
    } catch {
      setError('Unable to unfollow this user.');
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        follows,
        currentUserUid,
        isLoading,
        error,
        followUser,
        unfollowUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUsers must be used inside a UserProvider.');
  }

  return context;
};
