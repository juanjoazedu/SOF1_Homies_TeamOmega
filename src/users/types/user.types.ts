import type { IsoDate } from '../../shared/utils/formatDate';

export interface User {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  dateOfBirth: IsoDate;
  photoURL?: string;
  bio?: string;
}

export interface Follow {
  followingUid: string;
  followerUid: string;
}