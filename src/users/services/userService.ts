import { mockFollows } from '../data/mockFollows';
import { mockUsers } from '../data/mockUsers';
import type { Follow, User } from '../types/user.types';

let follows = [...mockFollows];

export const userService = {
  async getUsers(): Promise<User[]> {
    return [...mockUsers].sort((a, b) => 
        a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' }));
  },

  async getFollows(): Promise<Follow[]> {
    return [...follows];
  },

  async followUser(followerUid: string, followingUid: string): Promise<void> {
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
  },

  async unfollowUser(
    followerUid: string,
    followingUid: string
  ): Promise<void> {
    follows = follows.filter(
      (follow) =>
        !(
          follow.followerUid === followerUid &&
          follow.followingUid === followingUid
        )
    );
  },
};