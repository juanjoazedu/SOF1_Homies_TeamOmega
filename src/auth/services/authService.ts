import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, runTransaction } from 'firebase/firestore';

import { FirebaseAuth, FirebaseDB } from '../../shared/firebase/firebaseConfig';
import type { IsoDate } from '../../shared/utils/formatDate';
import type { User } from '../../users/types/user.types';
import type { RegisterData, SessionUser } from '../types/auth.types';

export const MIN_PASSWORD_LENGTH = 6;

const usernamePattern = /^\w{4,15}$/;

const getTodayIsoDate = (): IsoDate => new Date().toLocaleDateString('en-CA') as IsoDate;

const toSessionUser = (user: User): SessionUser => ({
  uid: user.uid,
  email: user.email,
  username: user.username,
});

export const getErrorMessage = (error: unknown): string => (
  error instanceof Error ? error.message : 'Something went wrong. Try again.'
);

export const getSessionUser = async (uid: string): Promise<SessionUser | null> => {
  const snapshot = await getDoc(doc(FirebaseDB, 'users', uid));
  if (!snapshot.exists()) return null;

  return toSessionUser(snapshot.data() as User);
};

const getEmailByUsername = async (username: string): Promise<string | null> => {
  const snapshot = await getDoc(doc(FirebaseDB, 'usernames', username.toLowerCase()));
  if (!snapshot.exists()) return null;

  return snapshot.data().email as string;
};

const createProfile = async (user: User): Promise<void> => {
  const usernameRef = doc(FirebaseDB, 'usernames', user.username.toLowerCase());
  const userRef = doc(FirebaseDB, 'users', user.uid);

  await runTransaction(FirebaseDB, async (transaction) => {
    const usernameSnapshot = await transaction.get(usernameRef);
    if (usernameSnapshot.exists()) {
      throw new Error('That username is already taken.');
    }

    transaction.set(usernameRef, { uid: user.uid, email: user.email });
    transaction.set(userRef, user);
  });
};

export const loginWithUsername = async (
  username: string,
  password: string,
): Promise<SessionUser> => {
  const email = await getEmailByUsername(username.trim());
  if (!email) throw new Error('Incorrect username or password.');

  const credential = await signInWithEmailAndPassword(FirebaseAuth, email, password);
  const sessionUser = await getSessionUser(credential.user.uid);

  if (!sessionUser) {
    await signOut(FirebaseAuth);
    throw new Error('This account has no profile.');
  }

  return sessionUser;
};

export const registerUser = async (data: RegisterData): Promise<SessionUser> => {
  const fullName = data.fullName.trim();
  const username = data.username.trim();
  const email = data.email.trim().toLowerCase();

  if (!fullName) throw new Error('Full name is required.');
  if (!usernamePattern.test(username)) {
    throw new Error('Username must have 4 to 15 letters, numbers or underscores.');
  }
  if (!data.dateOfBirth) throw new Error('Date of birth is required.');
  if (await getEmailByUsername(username)) throw new Error('That username is already taken.');

  const credential = await createUserWithEmailAndPassword(FirebaseAuth, email, data.password);

  const newUser: User = {
    uid: credential.user.uid,
    fullName,
    username,
    email,
    dateOfBirth: data.dateOfBirth,
    dateOfRegistration: getTodayIsoDate(),
  };

  try {
    await createProfile(newUser);
  } catch (error) {
    await deleteUser(credential.user);
    throw error;
  }

  return toSessionUser(newUser);
};

const buildGoogleUsername = (firebaseUser: FirebaseUser): string => {
  const emailName = (firebaseUser.email ?? 'user').split('@')[0];
  const base = emailName.replace(/\W/g, '').slice(0, 10) || 'user';
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${suffix}`;
};

export const loginWithGoogle = async (): Promise<SessionUser> => {
  const credential = await signInWithPopup(FirebaseAuth, new GoogleAuthProvider());
  const firebaseUser = credential.user;

  const existingUser = await getSessionUser(firebaseUser.uid);
  if (existingUser) return existingUser;

  const newUser: User = {
    uid: firebaseUser.uid,
    fullName: firebaseUser.displayName ?? 'Homies user',
    username: buildGoogleUsername(firebaseUser),
    email: firebaseUser.email ?? '',
    dateOfRegistration: getTodayIsoDate(),
    ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
  };

  try {
    await createProfile(newUser);
  } catch (error) {
    await signOut(FirebaseAuth);
    throw error;
  }

  return toSessionUser(newUser);
};

export const logoutUser = async (): Promise<void> => {
  await signOut(FirebaseAuth);
};