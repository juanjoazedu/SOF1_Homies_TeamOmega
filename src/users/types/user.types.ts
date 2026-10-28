import type { IsoDate } from '../../shared/utils/formatDate';

export interface User {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  dateOfBirth: IsoDate;
  photoURL?: string;
}

export interface Follow {
  followerUid: string;
  followingUid: string;
}