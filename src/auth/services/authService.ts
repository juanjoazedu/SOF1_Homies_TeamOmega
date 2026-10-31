import type { IsoDate } from '../../shared/utils/formatDate';
import { addUser, getUserByEmail, getUserByUsername } from '../../users/services/userService';
import type { User } from '../../users/types/user.types';
import { mockCredentials } from '../data/mockCredentials';
import type { RegisterData, SessionUser, UserCredentials } from '../types/auth.types';

export const MIN_PASSWORD_LENGTH = 6;

const usernamePattern = /^\w{4,15}$/;

let credentials: UserCredentials[] = [...mockCredentials];

const toSessionUser = (user: User): SessionUser => ({
  uid: user.uid,
  email: user.email,
  username: user.username,
});

const getTodayIsoDate = (): IsoDate => new Date().toLocaleDateString('en-CA') as IsoDate;

export const checkCredentials = (username: string, password: string): SessionUser | null => {
  const user = getUserByUsername(username.trim());

  if (!user) return null;

  const credential = credentials.find((item) => item.uid === user.uid && item.password === password);

  if (!credential) return null;

  return toSessionUser(user);
};

export const registerUser = (data: RegisterData): SessionUser => {
  const fullName = data.fullName.trim();
  const username = data.username.trim();
  const email = data.email.trim().toLowerCase();

  if (!fullName) throw new Error('Full name is required.');
  if (!usernamePattern.test(username)) {
    throw new Error('Username must have 4 to 15 letters, numbers or underscores.');
  }
  if (data.password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must have at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (!data.dateOfBirth) throw new Error('Date of birth is required.');
  if (getUserByUsername(username)) throw new Error('That username is already taken.');
  if (getUserByEmail(email)) throw new Error('That email is already registered.');

  const newUser: User = {
    uid: crypto.randomUUID(),
    fullName,
    username,
    email,
    dateOfBirth: data.dateOfBirth,
    dateOfRegistration: getTodayIsoDate(),
  };

  addUser(newUser);
  credentials = [...credentials, { uid: newUser.uid, email, password: data.password }];

  return toSessionUser(newUser);
};