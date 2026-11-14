import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentReference,
  type Query,
  type Unsubscribe,
} from 'firebase/firestore';

import { FirebaseDB } from '../../shared/firebase/firebaseConfig';
import { deleteFile, uploadFile } from '../../shared/firebase/storageService';
import { getFileError } from '../../shared/utils/mediaFiles';
import type {
  Follow,
  ProfileUpdate,
  User,
  UserSummary,
} from '../types/user.types';

export const MAX_FULL_NAME_LENGTH = 50;
export const MAX_BIO_LENGTH = 160;

const MAX_BATCH_WRITES = 400;

type FollowField = 'followerUid' | 'followingUid';
type UsersListener = (users: UserSummary[]) => void;

interface PendingUpdate {
  ref: DocumentReference;
  data: Record<string, unknown>;
}

const followsCollection = collection(FirebaseDB, 'follows');
const tweetsCollection = collection(FirebaseDB, 'tweets');
const interactionsCollection = collection(FirebaseDB, 'tweetInteractions');

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

export const subscribeToAllUsers = (onChange: UsersListener): Unsubscribe => onSnapshot(
  collection(FirebaseDB, 'users'),
  (snapshot) => {
    const users = snapshot.docs.map((item) => toUserSummary(item.data() as User));
    onChange(sortByName(users));
  },
  () => onChange([]),
);

// Name and photo are copied into tweets, follows and retweets, so those copies are refreshed too.
const syncProfileCopies = async (summary: UserSummary): Promise<void> => {
  const copy = toUserSummary(summary);
  const updates: PendingUpdate[] = [];

  const collectUpdates = async (source: Query, data: Record<string, unknown>) => {
    const snapshot = await getDocs(source);
    snapshot.docs.forEach((item) => updates.push({ ref: item.ref, data }));
  };

  await Promise.all([
    collectUpdates(
      query(tweetsCollection, where('authorUid', '==', summary.uid)),
      { authorFullName: summary.fullName, authorPhotoURL: summary.photoURL ?? deleteField() },
    ),
    collectUpdates(
      query(followsCollection, where('followerUid', '==', summary.uid)),
      { follower: copy },
    ),
    collectUpdates(
      query(followsCollection, where('followingUid', '==', summary.uid)),
      { following: copy },
    ),
    collectUpdates(
      query(interactionsCollection, where('uid', '==', summary.uid), where('type', '==', 'retweet')),
      { user: copy },
    ),
  ]);

  const commits: Promise<void>[] = [];
  for (let index = 0; index < updates.length; index += MAX_BATCH_WRITES) {
    const batch = writeBatch(FirebaseDB);
    updates.slice(index, index + MAX_BATCH_WRITES).forEach(({ ref, data }) => {
      batch.update(ref, data);
    });
    commits.push(batch.commit());
  }

  await Promise.all(commits);
};

export const updateUserProfile = async (user: User, changes: ProfileUpdate): Promise<void> => {
  const fullName = changes.fullName.trim();
  const bio = changes.bio.trim();

  if (!fullName) throw new Error('Full name is required.');
  if (fullName.length > MAX_FULL_NAME_LENGTH) {
    throw new Error(`Full name cannot exceed ${MAX_FULL_NAME_LENGTH} characters.`);
  }
  if (bio.length > MAX_BIO_LENGTH) {
    throw new Error(`Bio cannot exceed ${MAX_BIO_LENGTH} characters.`);
  }
  if (changes.newPhoto) {
    const photoError = getFileError(changes.newPhoto, false);
    if (photoError) throw new Error(photoError);
  }

  const previousPhotoURL = user.photoURL ?? '';
  let photoURL = changes.removePhoto ? '' : previousPhotoURL;

  if (changes.newPhoto) {
    photoURL = await uploadFile(
      `avatars/${user.uid}/${crypto.randomUUID()}-${changes.newPhoto.name}`,
      changes.newPhoto,
    );
  }

  try {
    await updateDoc(doc(FirebaseDB, 'users', user.uid), {
      fullName,
      bio: bio || deleteField(),
      dateOfBirth: changes.dateOfBirth || deleteField(),
      photoURL: photoURL || deleteField(),
    });
  } catch (error) {
    if (changes.newPhoto) await deleteFile(photoURL);
    throw error;
  }

  if (fullName !== user.fullName || photoURL !== previousPhotoURL) {
    await syncProfileCopies({
      uid: user.uid,
      fullName,
      username: user.username,
      ...(photoURL ? { photoURL } : {}),
    });
  }

  if (previousPhotoURL && previousPhotoURL !== photoURL) await deleteFile(previousPhotoURL);
};