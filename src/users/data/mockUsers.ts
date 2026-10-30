import type { User } from '../types/user.types';

export const mockUsers: User[] = [
  {
    uid: 'u1',
    fullName: 'Ana Torres',
    username: 'ana_torres',
    email: 'ana.torres@example.com',
    dateOfBirth: '1998-04-15',
    photoURL: 'https://i.pravatar.cc/150?img=47',
    bio: 'Software engineer and tech enthusiast. Love to explore new technologies and share knowledge.',
  },
  {
    uid: 'u2',
    fullName: 'Diego Ramirez',
    username: 'diego_ramirez',
    email: 'diego.ramirez@example.com',
    photoURL: "https://i.pravatar.cc/150?img=12",
    dateOfBirth: '1996-09-22',
    bio: 'Passionate about web development and open-source projects. Always eager to learn and grow.',
  },
  {
    uid: 'u3',
    fullName: 'Sofia Martinez',
    username: 'sofia_martinez',
    email: 'sofia.martinez@example.com',
    photoURL: "https://i.pravatar.cc/150?img=5",
    dateOfBirth: '2000-01-10',
    bio: 'Digital nomad and travel blogger. Sharing my adventures and experiences around the world.',
  },
];
