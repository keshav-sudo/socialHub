import { Request, Response } from 'express';
import { FeedService } from '../services/FeedService.js';
import { FeedRegenerationService } from '../services/FeedRegenerationService.js';

export class FeedController {
  private feedService: FeedService;
  private regenerationService: FeedRegenerationService;

  constructor() {
    this.feedService = new FeedService();
    this.regenerationService = new FeedRegenerationService();
  }

  async getFeed(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
        });
      }

      const feed = await this.feedService.getUserFeed(userId, page, limit);

      res.json({
        success: true,
        ...feed,
      });
    } catch (error) {
      console.error('Error fetching feed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch feed',
      });
    }
  }

  async regenerateFeed(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { followingIds } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
        });
      }

      if (!Array.isArray(followingIds)) {
        return res.status(400).json({
          success: false,
          error: 'followingIds array is required',
        });
      }

      await this.regenerationService.regenerateUserFeed(userId, followingIds);

      res.json({
        success: true,
        message: 'Feed regenerated successfully',
        userId,
      });
    } catch (error) {
      console.error('Error regenerating feed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to regenerate feed',
      });
    }
  }

  async batchRegenerateFeed(req: Request, res: Response) {
    try {
      const { userIds } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'userIds array is required',
        });
      }

      this.regenerationService.batchRegenerateFeeds(userIds).catch(err => {
        console.error('Batch regeneration error:', err);
      });

      res.json({
        success: true,
        message: `Batch regeneration started for ${userIds.length} users`,
      });
    } catch (error) {
      console.error('Error starting batch regeneration:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start batch regeneration',
      });
    }
  }

  async invalidateFeed(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
        });
      }

      await this.feedService.invalidateFeed(userId);

      res.json({
        success: true,
        message: 'Feed cache invalidated',
      });
    } catch (error) {
      console.error('Error invalidating feed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to invalidate feed',
      });
    }
  }

  async addPostToFeeds(req: Request, res: Response) {
    try {
      const { authorId, postId, username } = req.body;

      if (!authorId || !postId || !username) {
        return res.status(400).json({
          success: false,
          error: 'authorId, postId, and username are required',
        });
      }

      await this.feedService.addPostToFollowerFeeds(authorId, postId, username);

      res.json({
        success: true,
        message: 'Post added to follower feeds',
      });
    } catch (error) {
      console.error('Error adding post to feeds:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add post to feeds',
      });
    }
  }

  async cacheFollowers(req: Request, res: Response) {
    try {
      const { userId, followerIds } = req.body;

      if (!userId || !Array.isArray(followerIds)) {
        return res.status(400).json({
          success: false,
          error: 'userId and followerIds array are required',
        });
      }

      await this.feedService.cacheFollowers(userId, followerIds);

      res.json({
        success: true,
        message: `Cached ${followerIds.length} followers`,
      });
    } catch (error) {
      console.error('Error caching followers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cache followers',
      });
    }
  }

  async cacheFollowing(req: Request, res: Response) {
    try {
      const { userId, followingIds } = req.body;

      if (!userId || !Array.isArray(followingIds)) {
        return res.status(400).json({
          success: false,
          error: 'userId and followingIds array are required',
        });
      }

      await this.feedService.cacheFollowing(userId, followingIds);

      res.json({
        success: true,
        message: `Cached ${followingIds.length} following`,
      });
    } catch (error) {
      console.error('Error caching following:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cache following',
      });
    }
  }

  async health(req: Request, res: Response) {
    res.json({
      success: true,
      service: 'feed-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
