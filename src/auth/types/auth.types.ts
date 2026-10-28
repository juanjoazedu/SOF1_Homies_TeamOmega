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

export interface AuthContextValue {
  authState: AuthState;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export type AuthState = { status: 'checking' } | { status: 'authenticated'; sessionUser: SessionUser; } | { status: 'not-authenticated'; };

export type AuthAction = { type: 'login'; sessionUser: SessionUser; } | { type: 'logout'; };