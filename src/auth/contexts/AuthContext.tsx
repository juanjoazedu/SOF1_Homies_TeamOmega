import { createContext } from 'react';

import type { AuthContextValue } from '../types/auth.types';

export const AuthContext = createContext<AuthContextValue>({
  authState: { status: 'checking' },
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
});