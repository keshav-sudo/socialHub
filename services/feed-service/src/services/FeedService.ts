import { redisClient } from '../config/redis.js';
import { FeedRegenerationService } from './FeedRegenerationService.js';

export class FeedService {
  private regenerationService: FeedRegenerationService;

  constructor() {
    this.regenerationService = new FeedRegenerationService();
  }

  /**
   * Add a post to all follower feeds (Fan-out on write approach)
   * This is called when a new post is created
   */
  async addPostToFollowerFeeds(authorId: string, postId: string, username: string) {
    try {
      // Get list of followers from Redis cache or database
      const followers = await this.getFollowers(authorId);

      if (followers.length === 0) {
        console.log(`No followers found for user ${authorId}`);
        return;
      }

      // Add post to each follower's feed using Redis sorted set
      // Score is timestamp for chronological ordering
      const timestamp = Date.now();
      const pipeline = redisClient.multi();

      for (const followerId of followers) {
        const feedKey = `feed:${followerId}`;
        
        // Add to sorted set (score = timestamp, member = postId)
        pipeline.zAdd(feedKey, { score: timestamp, value: postId });
        
        // Keep only latest 100 posts in feed
        pipeline.zRemRangeByRank(feedKey, 0, -101);
        
        // Set expiry of 7 days
        pipeline.expire(feedKey, 7 * 24 * 60 * 60);
      }

      await pipeline.exec();
      console.log(`✅ Post ${postId} added to ${followers.length} follower feeds`);
    } catch (error) {
      console.error('❌ Error adding post to feeds:', error);
      throw error;
    }
  }

  /**
   * Get followers of a user from cache
   * In production, this would fetch from Users database
   */
  async getFollowers(userId: string): Promise<string[]> {
    try {
      // Try to get from cache first
      const cacheKey = `followers:${userId}`;
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      // In production: Fetch from Users database
      // For now, return empty array
      // TODO: Integrate with Users service to fetch actual followers
      return [];
    } catch (error) {
      console.error('❌ Error getting followers:', error);
      return [];
    }
  }

  /**
   * Get user's following list (users they follow)
   */
  async getFollowing(userId: string): Promise<string[]> {
    try {
      const cacheKey = `following:${userId}`;
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      // TODO: Fetch from Users database
      return [];
    } catch (error) {
      console.error('❌ Error getting following:', error);
      return [];
    }
  }

  /**
   * Update engagement score for a post
   * Higher engagement = higher score = appears higher in feed
   */
  async updatePostEngagement(postId: string, engagementType: 'like' | 'comment') {
    try {
      const scoreKey = `post:engagement:${postId}`;
      
      // Different weights for different engagement types
      const weight = engagementType === 'comment' ? 2 : 1;
      
      await redisClient.incrBy(scoreKey, weight);
      await redisClient.expire(scoreKey, 7 * 24 * 60 * 60); // 7 days expiry

      console.log(`✅ Engagement score updated for post ${postId} (+${weight})`);
    } catch (error) {
      console.error('❌ Error updating engagement:', error);
    }
  }

  /**
   * Get user feed with pagination
   * Returns posts in reverse chronological order with engagement ranking
   * 
   * IMPORTANT: If feed cache is empty, triggers regeneration (lazy loading)
   */
  async getUserFeed(userId: string, page: number = 1, limit: number = 20) {
    try {
      const feedKey = `feed:${userId}`;
      
      // Check if feed exists, if not, regenerate it (lazy loading)
      const feedExists = await redisClient.exists(feedKey);
      
      if (!feedExists) {
        console.log(`📭 Feed cache miss for user ${userId}, attempting regeneration...`);
        
        // Get following list to regenerate feed
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

      // Get posts from sorted set (reverse order - latest first)
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

      // Get engagement scores for ranking
      const postsWithEngagement = await Promise.all(
        postIds.map(async (postId) => {
          const score = await redisClient.get(`post:engagement:${postId}`);
          return {
            postId,
            engagementScore: parseInt(score || '0'),
          };
        })
      );

      // Get total count
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

  /**
   * Invalidate user feed cache
   */
  async invalidateFeed(userId: string) {
    try {
      const feedKey = `feed:${userId}`;
      await redisClient.del(feedKey);
      console.log(`✅ Feed cache invalidated for user ${userId}`);
    } catch (error) {
      console.error('❌ Error invalidating feed:', error);
    }
  }

  /**
   * Cache followers list for a user
   * This should be called when follow relationships change
   */
  async cacheFollowers(userId: string, followerIds: string[]) {
    try {
      const cacheKey = `followers:${userId}`;
      await redisClient.set(cacheKey, JSON.stringify(followerIds), {
        EX: 3600, // 1 hour expiry
      });
      console.log(`✅ Cached ${followerIds.length} followers for user ${userId}`);
    } catch (error) {
      console.error('❌ Error caching followers:', error);
    }
  }

  /**
   * Cache following list for a user
   */
  async cacheFollowing(userId: string, followingIds: string[]) {
    try {
      const cacheKey = `following:${userId}`;
      await redisClient.set(cacheKey, JSON.stringify(followingIds), {
        EX: 3600, // 1 hour expiry
      });
      console.log(`✅ Cached ${followingIds.length} following for user ${userId}`);
    } catch (error) {
      console.error('❌ Error caching following:', error);
    }
  }
}
