import type { IsoDate } from '../../shared/utils/formatDate';

export interface SessionUser {
  uid: string;
  email: string;
  username: string;
}

export interface UserCredentials {
  uid: string;
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  dateOfBirth: IsoDate;
}

export type AuthState =
  | { status: 'checking' }
  | { status: 'authenticated'; sessionUser: SessionUser }
  | { status: 'not-authenticated' };

export type AuthAction =
  | { type: 'login'; sessionUser: SessionUser }
  | { type: 'logout' };

export interface AuthContextValue {
  authState: AuthState;
  login: (username: string, password: string) => boolean;
  register: (data: RegisterData) => void;
  logout: () => void;
}