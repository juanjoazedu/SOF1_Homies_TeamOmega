import type { Follow } from '../types/user.types';

export const mockFollows: Follow[] = [
  {
    followerUid: 'u1',
    followingUid: 'u2',
  },
  {
    followerUid: 'u2',
    followingUid: 'u1',
  },
  {
    followerUid: 'u3',
    followingUid: 'u1',
  }
];