import type { User } from '../types/user.types';

export const mockUsers: User[] = [
  {
    uid: 'u1',
    fullName: 'Ana Torres',
    username: 'ana_torres',
    email: 'ana.torres@example.com',
    dateOfBirth: '1998-04-15',
    photoURL: 'https://i.pravatar.cc/150?img=47',
  },
  {
    uid: 'u2',
    fullName: 'Diego Ramirez',
    username: 'diego_ramirez',
    email: 'diego.ramirez@example.com',
    dateOfBirth: '1996-09-22',
  },
];