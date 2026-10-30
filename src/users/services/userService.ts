import { mockFollows } from "../data/mockFollows";
import { mockUsers } from "../data/mockUsers";
import type { User } from "../types/user.types";

let follows = [...mockFollows];
let users = [...mockUsers];

const sortByName = (users: User[]) => [...users].sort(
  (a, b) => a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' }),
);

export const getFollowers = (uid: string): User[] => {
  const followerUids = follows.filter((follow) => follow.followingUid === uid).map((follow) => follow.followerUid);
  return sortByName(mockUsers.filter((user) => followerUids.includes(user.uid)));
};

export const getFollowings = (uid: string): User[] => {
  const followingsUids = follows.filter((follow) => follow.followerUid === uid).map((follow) => follow.followingUid);
  return sortByName(mockUsers.filter((user) => followingsUids.includes(user.uid)));
};

export const getFollowingsUids = (uid: string): string[] => {
  return follows.filter((follow) => follow.followerUid === uid).map((follow) => follow.followingUid);
};

export const followUser = (followerUid: string, followingUid: string): void => {
  const alreadyFollowing = follows.filter(
    (follow) =>
      follow.followerUid === followerUid &&
      follow.followingUid === followingUid
  ).length > 0;

  const userExists = mockUsers.filter(
    (user) => user.uid === followingUid
  ).length > 0;

  if (
    followerUid === followingUid ||
    alreadyFollowing ||
    !userExists
  ) {
    return;
  }

  follows = [...follows, { followerUid, followingUid }];
};

export const unfollowUser = (followerUid: string, followingUid: string): void => {
  follows = follows.filter(
    (follow) =>
      !(
        follow.followerUid === followerUid &&
        follow.followingUid === followingUid
      )
  );
};

export const getUserByUsername = (username: string): User | null => {
  return users.find((user) => user.username === username) || null;
}