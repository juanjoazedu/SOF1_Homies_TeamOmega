import { mockUsers } from '../../users/data/mockUsers';
import { mockCredentials } from '../data/mockCredentials';
import type { SessionUser } from '../types/auth.types';

export const checkCredentials = (email: string, password: string): SessionUser | null => {
  const credential = mockCredentials.find((c) => c.email === email && c.password === password);
  
  if (!credential) return null;

  const user = mockUsers.find((u) => u.uid === credential.uid); 
  if (!user) return null;

  return { uid: user.uid, email: user.email, username: user.username };
};