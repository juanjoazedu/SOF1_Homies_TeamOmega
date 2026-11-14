import type { IsoDate } from '../../shared/utils/formatDate';

export interface User {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  dateOfBirth?: IsoDate;
  photoURL?: string;
  bio?: string;
  dateOfRegistration: IsoDate;
}

export type UserSummary = Pick<User, 'uid' | 'fullName' | 'username' | 'photoURL'>;

export interface Follow {
  followerUid: string;
  followingUid: string;
  follower: UserSummary;
  following: UserSummary;
}

export interface ProfileUpdate {
  fullName: string;
  bio: string;
  dateOfBirth: IsoDate | '';
  newPhoto?: File;
  removePhoto: boolean;
}

export interface UsersContextValue {
  currentUser: User | null;
  followingUids: string[];
  follow: (target: UserSummary) => Promise<void>;
  unfollow: (targetUid: string) => Promise<void>;
  updateProfile: (changes: ProfileUpdate) => Promise<void>;
}