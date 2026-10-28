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
    photoURL: "https://i.pravatar.cc/150?img=12",
    dateOfBirth: '1996-09-22',
  },
  {
    uid: 'u3',
    fullName: 'Sofia Martinez',
    username: 'sofia_martinez',
    email: 'sofia.martinez@example.com',
    photoURL: "https://i.pravatar.cc/150?img=5",
    dateOfBirth: '2000-01-10',
  },
];
