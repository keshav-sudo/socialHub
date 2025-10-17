# 📰 Feed Service - Complete Implementation Guide

## 📋 Overview

The Feed Service generates personalized content feeds for users based on their social connections, interests, and engagement patterns. It aggregates posts from followed users, ranks them using various algorithms, and delivers them efficiently with pagination support.

**Status:** 🚧 **Implementation Guide - To Be Implemented**

This README serves as a comprehensive guide for students to understand and implement the Feed Service from scratch.

---

## 🎯 What Does a Feed Service Do?

Think of your Instagram or Twitter feed - it shows you posts from people you follow, but not just in chronological order. The Feed Service:

1. **Aggregates Content**: Collects posts from users you follow
2. **Ranks Content**: Decides which posts to show first
3. **Personalizes**: Shows content relevant to YOU
4. **Optimizes Performance**: Delivers fast, even with millions of posts

---

## 🏗️ Architecture & Design

### System Context
```
┌────────────┐         ┌────────────┐         ┌────────────┐
│   Users    │────────▶│    Feed    │◀────────│    Post    │
│  Service   │         │  Service   │         │  Service   │
│            │         │            │         │            │
│ (Follows)  │         │ (Ranking)  │         │  (Posts)   │
└────────────┘         └──────┬─────┘         └────────────┘
                              │
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
              ┌──────────┐        ┌──────────┐
              │PostgreSQL│        │  Redis   │
              │ (Posts)  │        │ (Cache)  │
              └──────────┘        └──────────┘
```

### Data Flow
```
User Request → Feed Service → Check Cache (Redis)
                    │               │
                    │               ├─ Cache Hit: Return immediately
                    │               │
                    │               ├─ Cache Miss: Continue
                    │               │
                    ├─ Get Following List (Users DB)
                    │
                    ├─ Get Posts from Following (Posts DB)
                    │
                    ├─ Apply Ranking Algorithm
                    │
                    ├─ Cache Results (Redis)
                    │
                    └─ Return to User
```

---

## 🔄 Complete Implementation Flow

### Phase 1: Project Setup

#### 1.1 Initialize Node.js Project
```bash
cd services/feed-service
npm init -y
```

#### 1.2 Install Dependencies
```bash
# Core dependencies
npm install express typescript tsx
npm install @prisma/client
npm install dotenv
npm install cors
npm install helmet

# Redis for caching
npm install ioredis

# Type definitions
npm install -D @types/express @types/node @types/cors

# Kafka (optional, for real-time updates)
npm install kafkajs
```

#### 1.3 Create TypeScript Configuration
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### 1.4 Create Project Structure
```bash
mkdir -p src/{routes,controller,services,models,config,utils}
touch src/index.ts
touch src/routes/feedRoutes.ts
touch src/controller/feedController.ts
touch src/services/feedService.ts
touch src/services/rankingService.ts
touch src/config/redis.ts
touch src/config/database.ts
```

#### 1.5 Setup package.json Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

### Phase 2: Database Setup

#### 2.1 Create Prisma Schema
Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// This schema connects to existing Users database
model User {
  id       String @id
  username String @unique
}

model Follow {
  id          String   @id
  followerId  String
  followingId String
  isActive    Boolean  @default(true)
  isDeleted   Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
  @@index([followerId, isActive])
  @@index([followingId, isActive])
}

// This connects to Posts database
model Post {
  id         String   @id
  userId     String
  content    String
  media      String[]
  visibility String   @default("public")
  likes      Int      @default(0)
  comments   Int      @default(0)
  createdAt  DateTime @default(now())

  @@index([userId, createdAt])
  @@index([visibility, createdAt])
}
```

#### 2.2 Generate Prisma Client
```bash
npx prisma generate
```

---

### Phase 3: Core Implementation

#### 3.1 Server Entry Point (`src/index.ts`)

```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import feedRoutes from './routes/feedRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(express.json()); // Parse JSON bodies

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'feed-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/v1/feed', feedRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Feed Service running on port ${PORT}`);
});
```

#### 3.2 Routes Definition (`src/routes/feedRoutes.ts`)

```typescript
import { Router } from 'express';
import { 
  getUserFeed, 
  getDiscoverFeed,
  getTrendingFeed 
} from '../controller/feedController';

const router = Router();

// Get personalized feed for authenticated user
// GET /api/v1/feed?page=1&limit=20
router.get('/', getUserFeed);

// Get discover feed (posts from non-followed users)
// GET /api/v1/feed/discover?page=1&limit=20
router.get('/discover', getDiscoverFeed);

// Get trending posts (high engagement)
// GET /api/v1/feed/trending?page=1&limit=20
router.get('/trending', getTrendingFeed);

export default router;
```

#### 3.3 Controller Logic (`src/controller/feedController.ts`)

```typescript
import { Request, Response } from 'express';
import FeedService from '../services/feedService';

const feedService = new FeedService();

/**
 * Get personalized feed for authenticated user
 * Shows posts from users they follow, ranked by algorithm
 */
export const getUserFeed = async (req: Request, res: Response) => {
  try {
    // Extract user info from header (set by nginx gateway)
    const userPayload = req.headers['x-user-payload'];
    
    if (!userPayload) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No user payload found. Request must come through gateway.' 
      });
    }

    const user = JSON.parse(userPayload as string);
    const userId = user.id;

    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    console.log(`📰 Fetching feed for user ${userId} (page ${page})`);

    // Get feed from service
    const feed = await feedService.getPersonalizedFeed(userId, limit, offset);

    res.json({
      success: true,
      userId,
      page,
      limit,
      count: feed.length,
      posts: feed
    });

  } catch (error: any) {
    console.error('Error getting user feed:', error);
    res.status(500).json({ 
      error: 'Failed to get feed',
      message: error.message 
    });
  }
};

/**
 * Get discover feed - posts from users NOT followed
 * Good for content discovery
 */
export const getDiscoverFeed = async (req: Request, res: Response) => {
  try {
    const userPayload = req.headers['x-user-payload'];
    
    if (!userPayload) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No user payload found' 
      });
    }

    const user = JSON.parse(userPayload as string);
    const userId = user.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    console.log(`🔍 Fetching discover feed for user ${userId}`);

    const feed = await feedService.getDiscoverFeed(userId, limit, offset);

    res.json({
      success: true,
      userId,
      page,
      limit,
      count: feed.length,
      posts: feed
    });

  } catch (error: any) {
    console.error('Error getting discover feed:', error);
    res.status(500).json({ 
      error: 'Failed to get discover feed',
      message: error.message 
    });
  }
};

/**
 * Get trending feed - most engaged posts globally
 */
export const getTrendingFeed = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    console.log(`🔥 Fetching trending feed`);

    const feed = await feedService.getTrendingFeed(limit, offset);

    res.json({
      success: true,
      page,
      limit,
      count: feed.length,
      posts: feed
    });

  } catch (error: any) {
    console.error('Error getting trending feed:', error);
    res.status(500).json({ 
      error: 'Failed to get trending feed',
      message: error.message 
    });
  }
};
```

#### 3.4 Feed Service Logic (`src/services/feedService.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { RedisClient, getCachedFeed, cacheFeed } from '../config/redis';
import RankingService from './rankingService';

const prisma = new PrismaClient();
const rankingService = new RankingService();

class FeedService {
  
  /**
   * Get personalized feed for a user
   * Algorithm:
   * 1. Check cache first (Redis)
   * 2. If miss, get following list
   * 3. Get posts from followed users
   * 4. Rank posts by algorithm
   * 5. Cache results
   * 6. Return
   */
  async getPersonalizedFeed(userId: string, limit: number, offset: number) {
    try {
      // Check cache first
      const cacheKey = `feed:user:${userId}:${limit}:${offset}`;
      const cached = await getCachedFeed(cacheKey);
      
      if (cached) {
        console.log('✅ Cache hit for user feed');
        return cached;
      }

      console.log('❌ Cache miss, generating feed...');

      // Step 1: Get list of users this user follows
      const following = await prisma.follow.findMany({
        where: {
          followerId: userId,
          isActive: true,
          isDeleted: false
        },
        select: {
          followingId: true
        }
      });

      const followingIds = following.map(f => f.followingId);

      if (followingIds.length === 0) {
        // User doesn't follow anyone, return empty feed
        return [];
      }

      console.log(`📊 User follows ${followingIds.length} users`);

      // Step 2: Get posts from followed users
      const posts = await prisma.post.findMany({
        where: {
          userId: {
            in: followingIds
          },
          visibility: {
            in: ['public', 'followers'] // Don't show private posts
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit * 3, // Get more than needed for ranking
        skip: offset
      });

      console.log(`📝 Found ${posts.length} posts`);

      // Step 3: Apply ranking algorithm
      const rankedPosts = rankingService.rankPosts(posts, userId);

      // Step 4: Limit to requested amount
      const finalPosts = rankedPosts.slice(0, limit);

      // Step 5: Cache for 5 minutes
      await cacheFeed(cacheKey, finalPosts, 300);

      return finalPosts;

    } catch (error) {
      console.error('Error generating personalized feed:', error);
      throw error;
    }
  }

  /**
   * Get discover feed - posts from users NOT followed
   */
  async getDiscoverFeed(userId: string, limit: number, offset: number) {
    try {
      // Get list of users already followed
      const following = await prisma.follow.findMany({
        where: {
          followerId: userId,
          isActive: true,
          isDeleted: false
        },
        select: {
          followingId: true
        }
      });

      const followingIds = following.map(f => f.followingId);
      followingIds.push(userId); // Don't show own posts

      // Get posts from users NOT in following list
      const posts = await prisma.post.findMany({
        where: {
          userId: {
            notIn: followingIds
          },
          visibility: 'public' // Only public posts in discover
        },
        orderBy: [
          { likes: 'desc' },      // Most liked first
          { createdAt: 'desc' }   // Then recent
        ],
        take: limit,
        skip: offset
      });

      return posts;

    } catch (error) {
      console.error('Error generating discover feed:', error);
      throw error;
    }
  }

  /**
   * Get trending feed - globally popular posts
   */
  async getTrendingFeed(limit: number, offset: number) {
    try {
      const cacheKey = `feed:trending:${limit}:${offset}`;
      const cached = await getCachedFeed(cacheKey);
      
      if (cached) {
        return cached;
      }

      // Get posts from last 7 days with high engagement
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const posts = await prisma.post.findMany({
        where: {
          visibility: 'public',
          createdAt: {
            gte: sevenDaysAgo
          }
        },
        orderBy: [
          { likes: 'desc' },
          { comments: 'desc' }
        ],
        take: limit,
        skip: offset
      });

      // Cache for 10 minutes
      await cacheFeed(cacheKey, posts, 600);

      return posts;

    } catch (error) {
      console.error('Error generating trending feed:', error);
      throw error;
    }
  }
}

export default FeedService;
```

#### 3.5 Ranking Service (`src/services/rankingService.ts`)

```typescript
/**
 * Ranking algorithms for feed posts
 * Determines which posts show up first in the feed
 */

interface Post {
  id: string;
  userId: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

class RankingService {

  /**
   * Rank posts using engagement score
   * Score = (likes × 1) + (comments × 2) + recencyBoost
   */
  rankPosts(posts: Post[], userId: string): Post[] {
    const now = Date.now();

    // Calculate score for each post
    const scoredPosts = posts.map(post => {
      const ageInHours = (now - post.createdAt.getTime()) / (1000 * 60 * 60);
      
      // Recency boost: newer posts get higher score
      let recencyBoost = 0;
      if (ageInHours < 1) recencyBoost = 10;      // Very recent
      else if (ageInHours < 6) recencyBoost = 5;  // Recent
      else if (ageInHours < 24) recencyBoost = 2; // Today
      else recencyBoost = 0;                       // Older

      // Engagement score
      const engagementScore = (post.likes * 1) + (post.comments * 2);

      // Total score
      const totalScore = engagementScore + recencyBoost;

      return {
        ...post,
        score: totalScore
      };
    });

    // Sort by score (highest first)
    scoredPosts.sort((a, b) => b.score - a.score);

    return scoredPosts;
  }

  /**
   * Alternative: Chronological ranking (simple)
   */
  rankChronological(posts: Post[]): Post[] {
    return posts.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /**
   * Alternative: Engagement-only ranking
   */
  rankByEngagement(posts: Post[]): Post[] {
    return posts.sort((a, b) => {
      const scoreA = (a.likes * 1) + (a.comments * 2);
      const scoreB = (b.likes * 1) + (b.comments * 2);
      return scoreB - scoreA;
    });
  }
}

export default RankingService;
```

#### 3.6 Redis Configuration (`src/config/redis.ts`)

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

/**
 * Get cached feed from Redis
 */
export async function getCachedFeed(key: string): Promise<any | null> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('Error getting cached feed:', error);
    return null;
  }
}

/**
 * Cache feed in Redis with TTL
 */
export async function cacheFeed(
  key: string, 
  data: any, 
  ttlSeconds: number = 300
): Promise<void> {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching feed:', error);
  }
}

/**
 * Invalidate user's feed cache
 * Call this when user follows/unfollows someone
 */
export async function invalidateUserFeed(userId: string): Promise<void> {
  try {
    const pattern = `feed:user:${userId}:*`;
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️ Invalidated ${keys.length} cache keys for user ${userId}`);
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

export { redis as RedisClient };
```

#### 3.7 Environment Variables

Create `.env`:
```env
# Server
PORT=5005

# Database (connects to existing Posts & Users databases)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postsdb

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# CORS
CORS_ORIGIN=*
```

---

## 🚀 Running the Service

### Step 1: Install Dependencies
```bash
cd services/feed-service
npm install
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Start Redis (if not running)
```bash
docker-compose up -d redis
```

### Step 4: Run in Development Mode
```bash
npm run dev
```

### Step 5: Test It
```bash
# Get feed (need valid JWT token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5005/api/v1/feed?page=1&limit=10

# Health check
curl http://localhost:5005/health
```

---

## 📊 API Endpoints Reference

### 1. Get Personalized Feed
```http
GET /api/v1/feed?page=1&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "userId": "user-123",
  "page": 1,
  "limit": 20,
  "count": 15,
  "posts": [
    {
      "id": "post-1",
      "userId": "user-456",
      "content": "Post content",
      "likes": 42,
      "comments": 5,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Get Discover Feed
```http
GET /api/v1/feed/discover?page=1&limit=20
Headers: Authorization: Bearer <token>

Response: (same structure as above)
```

### 3. Get Trending Feed
```http
GET /api/v1/feed/trending?page=1&limit=20

Response: (same structure, no auth required)
```

---

## 🎯 Understanding the Algorithms

### Algorithm 1: Engagement Score Ranking

**Formula:**
```
Score = (Likes × 1) + (Comments × 2) + RecencyBoost

RecencyBoost:
- < 1 hour old: +10 points
- < 6 hours old: +5 points
- < 24 hours old: +2 points
- Older: 0 points
```

**Why this works:**
- Comments are worth more than likes (more engagement)
- Recent posts get boosted (keeps feed fresh)
- Balances popularity with recency

**Example:**
```
Post A: 50 likes, 10 comments, 30 min old
Score = (50 × 1) + (10 × 2) + 10 = 80

Post B: 100 likes, 5 comments, 2 days old
Score = (100 × 1) + (5 × 2) + 0 = 110

Result: Post B shows first (higher engagement)
```

### Algorithm 2: Chronological
Simply shows newest posts first. Simple but effective.

### Algorithm 3: Discover
Shows public posts from non-followed users, sorted by engagement. Good for content discovery.

---

## ⚡ Performance Optimizations

### 1. Redis Caching
- Cache feeds for 5 minutes
- 90%+ cache hit rate expected
- Reduces database load by 10x

### 2. Database Indexes
```sql
-- Essential indexes
CREATE INDEX idx_post_user_created ON Post(userId, createdAt DESC);
CREATE INDEX idx_post_visibility ON Post(visibility);
CREATE INDEX idx_follow_follower ON Follow(followerId, isActive);
```

### 3. Pagination
- Limit results per page
- Use offset for pagination
- Don't load everything at once

### 4. Feed Pre-generation (Advanced)
```typescript
// Run this periodically (e.g., every hour)
async function pregenerateFeedsForActiveUsers() {
  const activeUsers = await getActiveUsers(); // Users active in last 24h
  
  for (const user of activeUsers) {
    await feedService.getPersonalizedFeed(user.id, 20, 0);
    // This caches the feed, so next request is instant
  }
}
```

---

## 🔄 Integration with Other Services

### With Users Service
```
Follow/Unfollow → Invalidate user's feed cache

Implementation:
- Users service publishes Kafka event
- Feed service consumes event
- Clears cache for affected user
```

### With Post Service
```
New Post Created → Invalidate follower feeds

Implementation:
- Post service publishes event
- Feed service consumes event
- Clears cache for all followers of post author
```

### Optional: Kafka Consumer for Real-time Updates
```typescript
// src/consumers/kafkaConsumer.ts
import { Kafka } from 'kafkajs';
import { invalidateUserFeed } from '../config/redis';

const kafka = new Kafka({
  clientId: 'feed-service',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'feed-group' });

export async function startKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ 
    topics: ['USER_TOPIC', 'POST_TOPIC'], 
    fromBeginning: false 
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value?.toString() || '{}');
      
      if (event.eventType === 'user.followed') {
        // User followed someone, invalidate their feed
        await invalidateUserFeed(event.followerId);
      }
      
      if (event.eventType === 'post.created') {
        // Post created, invalidate feeds of all followers
        // (This requires getting follower list, which can be expensive)
        // Better approach: Use time-based cache expiry
      }
    }
  });
}
```

---

## 🧪 Testing Guide

### Manual Testing with curl

```bash
# 1. Login to get token
TOKEN=$(curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@test.com","password":"password"}' \
  | jq -r '.token')

# 2. Get your feed
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/api/v1/feed

# 3. Get discover feed
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/api/v1/feed/discover

# 4. Get trending
curl http://localhost/api/v1/feed/trending
```

### Unit Testing (Optional)
```typescript
// tests/rankingService.test.ts
import RankingService from '../src/services/rankingService';

describe('RankingService', () => {
  it('should rank posts by engagement', () => {
    const service = new RankingService();
    const posts = [
      { id: '1', likes: 10, comments: 5, createdAt: new Date() },
      { id: '2', likes: 50, comments: 2, createdAt: new Date() }
    ];
    
    const ranked = service.rankByEngagement(posts);
    expect(ranked[0].id).toBe('2'); // Higher engagement
  });
});
```

---

## 🎓 Learning Exercises

### Beginner
1. **Add logging**: Log every feed request with user ID and timing
2. **Add error handling**: Wrap all database calls in try-catch
3. **Test with Postman**: Create a collection of feed requests

### Intermediate
4. **Implement cache invalidation**: Clear cache when user follows/unfollows
5. **Add new ranking algorithm**: Implement "most recent" sorting
6. **Add filtering**: Allow filtering by hashtags or media type

### Advanced
7. **Implement Kafka consumer**: Listen for follow/post events
8. **Add feed pre-generation**: Generate feeds for active users in background
9. **Implement A/B testing**: Test different ranking algorithms
10. **Add analytics**: Track which posts get clicked in feed

---

## 🐛 Troubleshooting

### Issue 1: Empty Feed
**Cause:** User doesn't follow anyone
**Solution:** Return helpful message or show discover feed

### Issue 2: Slow Performance
**Cause:** Cache not working or missing indexes
**Solution:** 
- Check Redis connection
- Verify database indexes exist
- Monitor query performance

### Issue 3: Stale Content
**Cause:** Cache TTL too long
**Solution:** Reduce cache TTL or implement cache invalidation

### Issue 4: Out of Memory
**Cause:** Loading too many posts at once
**Solution:** Reduce `limit` parameter or implement cursor-based pagination

---

## 📚 Further Reading

- **Feed Ranking Algorithms**: [Instagram Feed Ranking](https://engineering.fb.com/2021/01/26/ml-applications/news-feed-ranking/)
- **Caching Strategies**: [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- **Pagination**: [Cursor vs Offset Pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination)

---

## 🎯 Success Criteria

You've successfully implemented the Feed Service when:

- [ ] Service starts without errors
- [ ] Personalized feed returns posts from followed users
- [ ] Discover feed shows posts from non-followed users
- [ ] Trending feed shows popular posts
- [ ] Caching works (check Redis)
- [ ] Pagination works correctly
- [ ] Performance is acceptable (<100ms with cache, <500ms without)

---

## 💡 Next Steps

1. **Implement the code** following this guide
2. **Test thoroughly** with different users and scenarios
3. **Add Kafka integration** for real-time updates
4. **Optimize performance** by monitoring and profiling
5. **Add more features** like hashtag filtering, search, etc.

---

**Remember:** Start simple, make it work, then optimize. Don't try to implement everything at once!

Good luck building your Feed Service! 🚀

---

**Made with ❤️ for students learning microservices architecture**
