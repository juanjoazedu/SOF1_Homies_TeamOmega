import { onAuthStateChanged } from 'firebase/auth';
import {
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';

import { FirebaseAuth } from '../../shared/firebase/firebaseConfig';
import { authReducer } from '../reducers/authReducer';
import {
  getSessionUser,
  loginWithGoogle as loginWithGoogleService,
  loginWithUsername,
  logoutUser,
  registerUser,
} from '../services/authService';
import type { AuthState, RegisterData, SessionUser } from '../types/auth.types';
import { AuthContext } from './AuthContext';

const initialState: AuthState = { status: 'checking' };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const isAuthActionRunning = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, async (firebaseUser) => {
      if (isAuthActionRunning.current) return;

      if (!firebaseUser) {
        dispatch({ type: 'logout' });
        return;
      }

      try {
        const sessionUser = await getSessionUser(firebaseUser.uid);

        if (sessionUser) {
          dispatch({ type: 'login', sessionUser });
        } else {
          dispatch({ type: 'logout' });
        }
      } catch {
        dispatch({ type: 'logout' });
      }
    });

    return unsubscribe;
  }, []);

  const runAuthAction = async (action: () => Promise<SessionUser>) => {
    isAuthActionRunning.current = true;

    try {
      const sessionUser = await action();
      dispatch({ type: 'login', sessionUser });
    } finally {
      isAuthActionRunning.current = false;
    }
  };

  const login = (username: string, password: string) => (
    runAuthAction(() => loginWithUsername(username, password))
  );

  const register = (data: RegisterData) => runAuthAction(() => registerUser(data));

  const loginWithGoogle = () => runAuthAction(loginWithGoogleService);

  const logout = () => logoutUser();

  return (
    <AuthContext.Provider value={{
      authState,
      login,
      register,
      loginWithGoogle,
      logout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};