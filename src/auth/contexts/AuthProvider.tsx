import { useReducer, type ReactNode } from 'react';

import { AuthContext } from './AuthContext';
import { authReducer } from '../reducers/authReducer';
import type { AuthState, SessionUser } from '../types/auth.types';

import { mockUsers } from '../../users/data/mockUsers';
import { checkCredentials } from '../services/authService';

const [defaultUser] = mockUsers;

const defaultSession: SessionUser = {
  uid: defaultUser.uid,
  email: defaultUser.email,
  username: defaultUser.username,
};

const initialState: AuthState = {
  status: 'authenticated',
  sessionUser: defaultSession,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const login = (email: string, password: string) => {
    const sessionUser = checkCredentials(email, password);

    if (!sessionUser) return false;

    dispatch({ type: 'login', sessionUser });
    return true;
  };

  const logout = () => {
    dispatch({ type: 'logout' });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};