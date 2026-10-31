import { useReducer, type ReactNode } from 'react';

import { AuthContext } from './AuthContext';
import { authReducer } from '../reducers/authReducer';
import type { AuthState, RegisterData, SessionUser } from '../types/auth.types';

import { mockUsers } from '../../users/data/mockUsers';
import { checkCredentials, registerUser } from '../services/authService';

const [defaultUser] = mockUsers;

const defaultSession: SessionUser = {
  uid: defaultUser.uid,
  email: defaultUser.email,
  username: defaultUser.username,
};

const initialState: AuthState = {
  status: 'not-authenticated',
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const login = (username: string, password: string) => {
    const sessionUser = checkCredentials(username, password);

    if (!sessionUser) return false;

    dispatch({ type: 'login', sessionUser });
    return true;
  };

  const register = (data: RegisterData) => {
    const sessionUser = registerUser(data);
    dispatch({ type: 'login', sessionUser });
  };

  const logout = () => {
    dispatch({ type: 'logout' });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};