import { Router } from 'express';
import { FeedController } from '../controllers/FeedController.js';

const router = Router();
const feedController = new FeedController();

// Health check
router.get('/health', feedController.health.bind(feedController));

// Get user feed (with auto-regeneration if cache empty)
router.get('/:userId', feedController.getFeed.bind(feedController));

// Invalidate user feed cache
router.delete('/:userId', feedController.invalidateFeed.bind(feedController));

// Manually regenerate feed for a user
router.post('/regenerate/:userId', feedController.regenerateFeed.bind(feedController));

// Batch regenerate feeds
router.post('/batch-regenerate', feedController.batchRegenerateFeed.bind(feedController));

// Manually add post to feeds (for testing or manual triggers)
router.post('/post', feedController.addPostToFeeds.bind(feedController));

// Cache followers for a user
router.post('/cache-followers', feedController.cacheFollowers.bind(feedController));

// Cache following for a user
router.post('/cache-following', feedController.cacheFollowing.bind(feedController));

export default router;
