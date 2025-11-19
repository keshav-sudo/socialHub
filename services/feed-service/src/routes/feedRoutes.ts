import { Router } from 'express';
import { FeedController } from '../controllers/FeedController.js';

const router = Router();
const feedController = new FeedController();

router.get('/health', feedController.health.bind(feedController));
router.get('/:userId', feedController.getFeed.bind(feedController));
router.delete('/:userId', feedController.invalidateFeed.bind(feedController));
router.post('/regenerate/:userId', feedController.regenerateFeed.bind(feedController));
router.post('/batch-regenerate', feedController.batchRegenerateFeed.bind(feedController));
router.post('/post', feedController.addPostToFeeds.bind(feedController));
router.post('/cache-followers', feedController.cacheFollowers.bind(feedController));
router.post('/cache-following', feedController.cacheFollowing.bind(feedController));

export default router;
