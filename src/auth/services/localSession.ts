import type { SessionUser } from '../types/auth.types';

const SESSION_KEY = 'homies-session';

export const getStoredSession = (): SessionUser | null => {
  try {
    const storedSession = localStorage.getItem(SESSION_KEY);
    return storedSession ? (JSON.parse(storedSession) as SessionUser) : null;
  } catch {
    return null;
  }
};

export const saveSession = (sessionUser: SessionUser): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};