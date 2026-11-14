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
import { clearSession, getStoredSession, saveSession } from '../services/localSession';
import type { AuthState, RegisterData, SessionUser } from '../types/auth.types';
import { AuthContext } from './AuthContext';

const getInitialState = (): AuthState => {
  const sessionUser = getStoredSession();
  return sessionUser ? { status: 'authenticated', sessionUser } : { status: 'checking' };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, undefined, getInitialState);
  const isAuthActionRunning = useRef(false);

  const startSession = (sessionUser: SessionUser) => {
    saveSession(sessionUser);
    dispatch({ type: 'login', sessionUser });
  };

  const endSession = () => {
    clearSession();
    dispatch({ type: 'logout' });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, async (firebaseUser) => {
      if (isAuthActionRunning.current) return;

      if (!firebaseUser) {
        endSession();
        return;
      }

      try {
        const sessionUser = await getSessionUser(firebaseUser.uid);

        if (sessionUser) {
          startSession(sessionUser);
        } else {
          await logoutUser();
        }
      } catch {
        if (!getStoredSession()) endSession();
      }
    });

    return unsubscribe;
  }, []);

  const runAuthAction = async (action: () => Promise<SessionUser>) => {
    isAuthActionRunning.current = true;

    try {
      startSession(await action());
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