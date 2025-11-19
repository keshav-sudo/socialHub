import { redisClient } from '../config/redis.js';
import { FeedRegenerationService } from './FeedRegenerationService.js';

export class FeedService {
  private regenerationService: FeedRegenerationService;

  constructor() {
    this.regenerationService = new FeedRegenerationService();
  }

  async addPostToFollowerFeeds(authorId: string, postId: string, username: string) {
    try {
      const followers = await this.getFollowers(authorId);

      if (followers.length === 0) {
        console.log(`No followers found for user ${authorId}`);
        return;
      }

      const timestamp = Date.now();
      const pipeline = redisClient.multi();

      for (const followerId of followers) {
        const feedKey = `feed:${followerId}`;
        pipeline.zAdd(feedKey, { score: timestamp, value: postId });
        pipeline.zRemRangeByRank(feedKey, 0, -101);
        pipeline.expire(feedKey, 7 * 24 * 60 * 60);
      }

      await pipeline.exec();
      console.log(`✅ Post ${postId} added to ${followers.length} follower feeds`);
    } catch (error) {
      console.error('❌ Error adding post to feeds:', error);
      throw error;
    }
  }

  async getFollowers(userId: string): Promise<string[]> {
    try {
      const cacheKey = `followers:${userId}`;
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      return [];
    } catch (error) {
      console.error('❌ Error getting followers:', error);
      return [];
    }
  }

  async getFollowing(userId: string): Promise<string[]> {
    try {
      const cacheKey = `following:${userId}`;
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      return [];
    } catch (error) {
      console.error('❌ Error getting following:', error);
      return [];
    }
  }

  async updatePostEngagement(postId: string, engagementType: 'like' | 'comment') {
    try {
      const scoreKey = `post:engagement:${postId}`;
      const weight = engagementType === 'comment' ? 2 : 1;
      
      await redisClient.incrBy(scoreKey, weight);
      await redisClient.expire(scoreKey, 7 * 24 * 60 * 60);

      console.log(`✅ Engagement score updated for post ${postId} (+${weight})`);
    } catch (error) {
      console.error('❌ Error updating engagement:', error);
    }
  }

  async getUserFeed(userId: string, page: number = 1, limit: number = 20) {
    try {
      const feedKey = `feed:${userId}`;
      const feedExists = await redisClient.exists(feedKey);
      
      if (!feedExists) {
        console.log(`📭 Feed cache miss for user ${userId}, attempting regeneration...`);
        
        const followingIds = await this.getFollowing(userId);
        
        if (followingIds.length > 0) {
          await this.regenerationService.ensureFeedExists(userId, followingIds);
        } else {
          console.log(`⚠️ User ${userId} is not following anyone, empty feed`);
          return { 
            posts: [], 
            total: 0, 
            page, 
            limit, 
            hasMore: false,
            regenerated: false,
            message: 'User is not following anyone'
          };
        }
      }

      const start = (page - 1) * limit;
      const end = start + limit - 1;

      const postIds = await redisClient.zRange(feedKey, start, end, { REV: true });

      if (postIds.length === 0) {
        return { 
          posts: [], 
          total: 0, 
          page, 
          limit, 
          hasMore: false,
          regenerated: !feedExists
        };
      }

      const postsWithEngagement = await Promise.all(
        postIds.map(async (postId) => {
          const score = await redisClient.get(`post:engagement:${postId}`);
          return {
            postId,
            engagementScore: parseInt(score || '0'),
          };
        })
      );

      const total = await redisClient.zCard(feedKey);
      const hasMore = (start + limit) < total;

      return {
        posts: postsWithEngagement,
        total,
        page,
        limit,
        hasMore,
        regenerated: !feedExists
      };
    } catch (error) {
      console.error('❌ Error getting user feed:', error);
      throw error;
    }
  }

  async invalidateFeed(userId: string) {
    try {
      const feedKey = `feed:${userId}`;
      await redisClient.del(feedKey);
      console.log(`✅ Feed cache invalidated for user ${userId}`);
    } catch (error) {
      console.error('❌ Error invalidating feed:', error);
    }
  }

  async cacheFollowers(userId: string, followerIds: string[]) {
    try {
      const cacheKey = `followers:${userId}`;
      await redisClient.set(cacheKey, JSON.stringify(followerIds), {
        EX: 3600,
      });
      console.log(`✅ Cached ${followerIds.length} followers for user ${userId}`);
    } catch (error) {
      console.error('❌ Error caching followers:', error);
    }
  }

  async cacheFollowing(userId: string, followingIds: string[]) {
    try {
      const cacheKey = `following:${userId}`;
      await redisClient.set(cacheKey, JSON.stringify(followingIds), {
        EX: 3600,
      });
      console.log(`✅ Cached ${followingIds.length} following for user ${userId}`);
    } catch (error) {
      console.error('❌ Error caching following:', error);
    }
  }
}
