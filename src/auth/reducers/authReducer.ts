import type { AuthState, AuthAction } from '../types/auth.types';

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'login':
      return { status: 'authenticated', sessionUser: action.sessionUser };
    case 'logout':
      return { status: 'not-authenticated' };
    default:
      return state;
  }
};