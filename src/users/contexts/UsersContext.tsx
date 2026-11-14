import { createContext } from 'react';

import type { UsersContextValue } from '../types/user.types';

export const UsersContext = createContext<UsersContextValue>({
  currentUser: null,
  followingUids: [],
  follow: async () => {},
  unfollow: async () => {},
  updateProfile: async () => {},
});