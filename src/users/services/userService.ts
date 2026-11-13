import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import { FirebaseDB } from '../../shared/firebase/firebaseConfig';
import type { Follow, User, UserSummary } from '../types/user.types';

type FollowField = 'followerUid' | 'followingUid';
type UsersListener = (users: UserSummary[]) => void;

const followsCollection = collection(FirebaseDB, 'follows');

const getFollowId = (followerUid: string, followingUid: string): string => (
  `${followerUid}_${followingUid}`
);

const sortByName = (users: UserSummary[]): UserSummary[] => [...users].sort(
  (a, b) => a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' }),
);

export const toUserSummary = (user: UserSummary): UserSummary => ({
  uid: user.uid,
  fullName: user.fullName,
  username: user.username,
  ...(user.photoURL ? { photoURL: user.photoURL } : {}),
});

export const getUidByUsername = async (username: string): Promise<string | null> => {
  const snapshot = await getDoc(doc(FirebaseDB, 'usernames', username.toLowerCase()));
  return snapshot.exists() ? (snapshot.data().uid as string) : null;
};

export const subscribeToUser = (
  uid: string,
  onChange: (user: User | null) => void,
): Unsubscribe => onSnapshot(
  doc(FirebaseDB, 'users', uid),
  (snapshot) => onChange(snapshot.exists() ? (snapshot.data() as User) : null),
  () => onChange(null),
);

const subscribeToFollows = (
  field: FollowField,
  uid: string,
  onChange: UsersListener,
): Unsubscribe => onSnapshot(
  query(followsCollection, where(field, '==', uid)),
  (snapshot) => {
    const users = snapshot.docs.map((item) => {
      const follow = item.data() as Follow;
      return field === 'followingUid' ? follow.follower : follow.following;
    });
    onChange(sortByName(users));
  },
  () => onChange([]),
);

export const subscribeToFollowers = (uid: string, onChange: UsersListener): Unsubscribe => (
  subscribeToFollows('followingUid', uid, onChange)
);

export const subscribeToFollowing = (uid: string, onChange: UsersListener): Unsubscribe => (
  subscribeToFollows('followerUid', uid, onChange)
);

export const followUser = async (follower: UserSummary, following: UserSummary): Promise<void> => {
  if (follower.uid === following.uid) return;

  const follow: Follow = {
    followerUid: follower.uid,
    followingUid: following.uid,
    follower: toUserSummary(follower),
    following: toUserSummary(following),
  };

  await setDoc(doc(followsCollection, getFollowId(follower.uid, following.uid)), follow);
};

export const unfollowUser = async (followerUid: string, followingUid: string): Promise<void> => {
  await deleteDoc(doc(followsCollection, getFollowId(followerUid, followingUid)));
};