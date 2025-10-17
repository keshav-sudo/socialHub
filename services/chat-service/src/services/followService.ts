import { PrismaClient as UsersClient } from '../../generated/prisma/client-users/index.js';

const usersDb = new UsersClient();

interface FollowingResult {
  followingId: string;
}

interface FollowerResult {
  followerId: string;
}

export class FollowService {
  /**
   * Check if two users follow each other (mutual follow)
   * Users can only chat if they both follow each other
   */
  async canUsersChat(userId1: string, userId2: string): Promise<boolean> {
    try {
      // Check if user1 follows user2
      const user1FollowsUser2 = await usersDb.follow.findFirst({
        where: {
          followerId: userId1,
          followingId: userId2,
          isActive: true,
          isDeleted: false,
        },
      });

      // Check if user2 follows user1
      const user2FollowsUser1 = await usersDb.follow.findFirst({
        where: {
          followerId: userId2,
          followingId: userId1,
          isActive: true,
          isDeleted: false,
        },
      });

      // Both must follow each other
      return !!(user1FollowsUser2 && user2FollowsUser1);
    } catch (error) {
      console.error('Error checking follow relationship:', error);
      return false;
    }
  }

  /**
   * Check if a user follows another user
   */
  async doesUserFollow(followerId: string, followingId: string): Promise<boolean> {
    try {
      const follow = await usersDb.follow.findFirst({
        where: {
          followerId,
          followingId,
          isActive: true,
          isDeleted: false,
        },
      });

      return !!follow;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  /**
   * Get list of users that the given user follows (and who follow back)
   * These are the users that the given user can chat with
   */
  async getChatableUsers(userId: string): Promise<string[]> {
    try {
      // Get users that userId follows
      const following = await usersDb.follow.findMany({
        where: {
          followerId: userId,
          isActive: true,
          isDeleted: false,
        },
        select: {
          followingId: true,
        },
      });

      const followingIds = following.map((f: FollowingResult) => f.followingId);

      if (followingIds.length === 0) {
        return [];
      }

      // Get users from that list who also follow back
      const mutualFollows = await usersDb.follow.findMany({
        where: {
          followerId: { in: followingIds },
          followingId: userId,
          isActive: true,
          isDeleted: false,
        },
        select: {
          followerId: true,
        },
      });

      return mutualFollows.map((f: FollowerResult) => f.followerId);
    } catch (error) {
      console.error('Error getting chatable users:', error);
      return [];
    }
  }
}
