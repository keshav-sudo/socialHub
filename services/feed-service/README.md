# Feed Service - Scalable Real-time Feed System

## 📋 Overview
Scalable feed service that consumes Kafka events from Post, Like, and Comment services to build real-time user feeds using Redis for high-performance caching and Fan-out on Write strategy.

---

## 🏗️ Architecture

```
Post/Like/Comment Services
    ↓ (Emit Kafka Events)
Kafka Topics: POST_TOPIC, LIKE_TOPIC, COMMENT_TOPIC
    ↓
Feed Service (Kafka Consumer)
    ↓
Redis (Sorted Sets for Feeds)
    ↓
REST API (User Feed Retrieval)
```

---

## 🔥 Key Features

### ✅ Fan-out on Write Strategy
- When a post is created, it's immediately written to all follower feeds
- Fast read operations (no complex queries at read time)
- Feeds are pre-built and cached in Redis

### ✅ Real-time Event Processing
- Consumes Kafka events from:
  - **POST_TOPIC**: New posts created
  - **LIKE_TOPIC**: Posts liked
  - **COMMENT_TOPIC**: Comments on posts
- Automatically updates feeds and engagement scores

### ✅ Redis-based Caching
- Uses Redis Sorted Sets for chronological ordering
- Each user has their own feed: `feed:${userId}`
- Posts scored by timestamp for latest-first ordering
- Engagement scores tracked separately: `post:engagement:${postId}`

### ✅ Scalable Architecture
- Multiple instances can run simultaneously
- Kafka consumer groups ensure each event processed once
- Redis provides shared state across instances
- Stateless service design

### ✅ Smart Engagement Ranking
- Tracks likes and comments per post
- Different weights: comments (2 points), likes (1 point)
- Used for ranking/sorting feeds by popularity

---

## 📊 Data Flow

### 1. Post Creation Flow
```
1. User creates post in Post Service
2. Post Service emits event to POST_TOPIC:
   {
     eventType: "post.created",
     data: { postId, authorId, username }
   }
3. Feed Service consumes event
4. Fetches author's followers from cache
5. Adds postId to each follower's feed in Redis
6. Feed appears instantly in follower feeds
```

### 2. Engagement Flow
```
1. User likes/comments on post
2. Post Service emits to LIKE_TOPIC or COMMENT_TOPIC
3. Feed Service updates engagement score
4. Higher engagement = better ranking
```

### 3. Feed Retrieval Flow
```
1. User requests feed via GET /api/feed/:userId
2. Feed Service queries Redis sorted set
3. Returns posts in reverse chronological order
4. Includes engagement scores for ranking
```

---

## 🛣️ API Endpoints

### 1. Get User Feed
```http
GET /api/feed/:userId?page=1&limit=20

Response:
{
  "success": true,
  "posts": [
    {
      "postId": "post123",
      "engagementScore": 15
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

### 2. Invalidate Feed Cache
```http
DELETE /api/feed/:userId

Response:
{
  "success": true,
  "message": "Feed cache invalidated"
}
```

### 3. Manually Add Post to Feeds (Testing)
```http
POST /api/feed/post
Body:
{
  "authorId": "user123",
  "postId": "post456",
  "username": "john"
}

Response:
{
  "success": true,
  "message": "Post added to follower feeds"
}
```

### 4. Cache Followers (Integration)
```http
POST /api/feed/cache-followers
Body:
{
  "userId": "user123",
  "followerIds": ["user456", "user789"]
}

Response:
{
  "success": true,
  "message": "Cached 2 followers"
}
```

### 5. Health Check
```http
GET /health

Response:
{
  "success": true,
  "service": "feed-service",
  "status": "ok",
  "timestamp": "2024-10-17T04:00:00.000Z"
}
```

---

## 📁 Project Structure

```
feed-service/
├── src/
│   ├── index.ts                    # Main server & startup
│   ├── config/
│   │   ├── redis.ts               # Redis client configuration
│   │   └── kafka.ts               # Kafka client configuration
│   ├── consumers/
│   │   └── kafkaConsumer.ts       # Kafka event consumer
│   ├── services/
│   │   └── FeedService.ts         # Core feed logic
│   ├── controllers/
│   │   └── FeedController.ts      # API request handlers
│   └── routes/
│       └── feedRoutes.ts          # API routes
├── Dockerfile                      # Docker container config
├── docker-compose.yml             # Multi-service orchestration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── .env                           # Environment variables
```

---

## 🔧 Environment Variables

```env
# Server
PORT=5005

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Kafka Configuration
KAFKA_BROKER=kafka:9092
KAFKA_CLIENT_ID=feed-service
KAFKA_GROUP_ID=feed-service-group

# CORS
CORS_ORIGIN=*
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd feed-service
npm install
```

### 2. Build TypeScript
```bash
npm run build
```

### 3. Run Locally (Development)
```bash
npm run dev
```

### 4. Run Production
```bash
npm start
```

### 5. Docker Build
```bash
docker build -t feed-service .
```

### 6. Docker Compose (Full Stack)
```bash
# From project root
docker-compose up feed-service
```

---

## 🐳 Docker Integration

### Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5005
CMD ["npm", "start"]
```

### Add to docker-compose.yml
```yaml
feed-service:
  build: ./services/feed-service
  ports:
    - "5005:5005"
  env_file:
    - ./services/feed-service/.env
  depends_on:
    - redis
    - kafka
  networks:
    - socialhub-network
```

### Nginx Configuration
```nginx
# Add to gateway/nginx.conf

location /feed/ {
    auth_request /auth/verify;
    auth_request_set $auth_user_payload $upstream_http_x_user_payload;
    proxy_set_header x-user-payload $auth_user_payload;

    rewrite /feed/(.*) /api/feed/$1 break;
    proxy_pass http://feed_service;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Add upstream
upstream feed_service {
    server feed-service:5005;
}
```

---

## 🎯 Kafka Event Handling

### Events Consumed

#### 1. POST_TOPIC - post.created
```json
{
  "eventType": "post.created",
  "timestamp": "2024-10-17T04:00:00.000Z",
  "data": {
    "postId": "post123",
    "authorId": "user456",
    "username": "john"
  }
}
```
**Action**: Adds post to all follower feeds

#### 2. LIKE_TOPIC - like.created
```json
{
  "eventType": "like.created",
  "timestamp": "2024-10-17T04:00:00.000Z",
  "data": {
    "postId": "post123",
    "userId": "user789"
  }
}
```
**Action**: Increments engagement score by 1

#### 3. COMMENT_TOPIC - comment.created
```json
{
  "eventType": "comment.created",
  "timestamp": "2024-10-17T04:00:00.000Z",
  "data": {
    "postId": "post123",
    "userId": "user789",
    "commentId": "comment456"
  }
}
```
**Action**: Increments engagement score by 2

---

## 📈 Redis Data Structure

### 1. User Feed (Sorted Set)
```
Key: feed:${userId}
Type: ZSET (Sorted Set)
Members: postId
Scores: timestamp (for chronological order)
Example:
  feed:user123 = {
    post789: 1697500000000,
    post456: 1697499999000,
    post123: 1697499998000
  }
```

### 2. Post Engagement Score
```
Key: post:engagement:${postId}
Type: String (Integer)
Value: Engagement count
Example:
  post:engagement:post123 = "15"
  (10 likes × 1 + 5 comments × 2 = 20)
```

### 3. Followers Cache
```
Key: followers:${userId}
Type: String (JSON array)
Value: Array of follower user IDs
TTL: 1 hour
Example:
  followers:user123 = '["user456", "user789"]'
```

---

## 🔄 Scaling Strategy

### Horizontal Scaling
```yaml
# Run multiple instances
feed-service-1:
  build: ./services/feed-service
  environment:
    - KAFKA_GROUP_ID=feed-service-group

feed-service-2:
  build: ./services/feed-service
  environment:
    - KAFKA_GROUP_ID=feed-service-group
```

**Benefits:**
- Kafka consumer group ensures events distributed across instances
- Redis provides shared cache
- No single point of failure
- Automatic load balancing

### Performance Optimization
1. **Feed Limit**: Keep only 100 latest posts per user
2. **Cache Expiry**: 7 days for feeds, 1 hour for followers
3. **Batch Operations**: Redis pipeline for multiple writes
4. **Async Processing**: Non-blocking event handling

---

## 🧪 Testing

### Test with curl

#### Get Feed
```bash
curl http://localhost:5005/api/feed/user123?page=1&limit=10
```

#### Manually Add Post
```bash
curl -X POST http://localhost:5005/api/feed/post \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "user123",
    "postId": "post456",
    "username": "john"
  }'
```

#### Cache Followers
```bash
curl -X POST http://localhost:5005/api/feed/cache-followers \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "followerIds": ["user456", "user789", "user101"]
  }'
```

### Test with Kafka
```bash
# Produce test event to POST_TOPIC
docker exec -it kafka /opt/kafka/bin/kafka-console-producer.sh \
  --broker-list localhost:9092 \
  --topic POST_TOPIC

# Paste this:
{"eventType":"post.created","timestamp":"2024-10-17T04:00:00.000Z","data":{"postId":"test123","authorId":"user456","username":"john"}}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "No followers found"
**Reason:** Followers not cached  
**Solution:** Call `/api/feed/cache-followers` endpoint or integrate with Users service

### Issue 2: "Empty feed"
**Reason:** No events consumed yet  
**Solution:** Create posts in Post service to trigger events

### Issue 3: "Kafka connection failed"
**Reason:** Kafka not running or wrong broker address  
**Solution:** Check `docker-compose ps` and verify KAFKA_BROKER env variable

### Issue 4: "Redis connection failed"
**Reason:** Redis not running  
**Solution:** Start Redis container: `docker-compose up redis`

### Issue 5: "Redis cache deleted / Feed disappeared"
**Reason:** Redis data lost (container restart, memory eviction, TTL expired)  
**Solution:** Feed auto-regenerates on next request (lazy loading) ✅

---

## 🔄 Feed Regeneration Strategy

### Problem: What if Redis Cache is Deleted?

Redis is an **in-memory** cache. Data can be lost due to:
- Container restart without persistence
- Memory eviction (when Redis runs out of memory)
- TTL expiry (feeds expire after 7 days)
- Manual deletion or cache invalidation

### Solution: Multi-Layer Recovery System

#### 1. **Lazy Loading (Auto-Regeneration)**
```
User requests feed → Cache miss detected → Auto-regenerate from database → Return feed
```

**How it works:**
- When user requests feed via `GET /api/feed/:userId`
- System checks if feed exists in Redis
- If NOT found, automatically regenerates from Post database
- User gets feed without knowing it was regenerated

**Code Flow:**
```javascript
// In FeedService.getUserFeed()
const feedExists = await redisClient.exists(feedKey);

if (!feedExists) {
  console.log('Feed cache miss, regenerating...');
  const followingIds = await this.getFollowing(userId);
  await regenerationService.ensureFeedExists(userId, followingIds);
}
// Continue to return feed...
```

#### 2. **Manual Regeneration API**
```http
POST /api/feed/regenerate/:userId
Body: { followingIds: ["user2", "user3"] }
```

Use cases:
- Admin manually triggers regeneration
- After bulk follow/unfollow operations
- Testing and debugging

#### 3. **Batch Regeneration**
```http
POST /api/feed/batch-regenerate
Body: { userIds: ["user1", "user2", "user3"] }
```

Use cases:
- Warm cache after Redis restart
- Scheduled jobs (nightly cache rebuild)
- Preload feeds for active users

#### 4. **Event-Driven Rebuild**
```
Post Created Event → Kafka → Feed Service → Add to follower feeds
```

- New posts automatically added to feeds
- No need to regenerate entire feed
- Only new content added incrementally

---

## 📦 Feed Recovery Architecture

```
┌─────────────────────────────────────────────────────────┐
│              USER REQUESTS FEED                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │ Redis Cache?   │
            └────────┬───────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼─────┐         ┌──────▼──────┐
    │  FOUND   │         │  NOT FOUND  │
    │ (Cache   │         │  (Cache     │
    │  Hit)    │         │   Miss)     │
    └────┬─────┘         └──────┬──────┘
         │                      │
         │              ┌───────▼────────┐
         │              │ Get Following  │
         │              │   List from    │
         │              │  Users DB      │
         │              └───────┬────────┘
         │                      │
         │              ┌───────▼────────┐
         │              │ Query Post DB  │
         │              │ for recent     │
         │              │ posts from     │
         │              │ following      │
         │              └───────┬────────┘
         │                      │
         │              ┌───────▼────────┐
         │              │ Rebuild Feed   │
         │              │ in Redis       │
         │              └───────┬────────┘
         │                      │
         └──────────────┬───────┘
                        │
                ┌───────▼────────┐
                │  Return Feed   │
                │   to User      │
                └────────────────┘
```

---

## 🎯 Data Source for Regeneration

When feed needs to be regenerated, data comes from:

### Primary Source: Post Service Database
```javascript
// Query Post database
const posts = await prisma.post.findMany({
  where: {
    authorId: { in: followingIds },  // Posts from users you follow
    createdAt: { 
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)  // Last 7 days
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 100  // Limit to 100 recent posts
});

// Add to Redis sorted set
for (const post of posts) {
  await redisClient.zAdd(`feed:${userId}`, {
    score: post.createdAt.getTime(),
    value: post.id
  });
}
```

### Supporting Data: Users Service Database
```javascript
// Get following list
const following = await usersDb.follow.findMany({
  where: {
    followerId: userId,
    isActive: true,
    isDeleted: false
  },
  select: { followingId: true }
});

const followingIds = following.map(f => f.followingId);
```

---

## 🚀 Implementation Steps for Full Recovery

### Step 1: Integrate with Post Service Database

Add Prisma client for Post database:

```bash
# In feed-service
npm install @prisma/client
```

Create schema:
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("POST_DATABASE_URL")
}

model Post {
  id        String   @id
  authorId  String
  content   String
  createdAt DateTime @default(now())
}
```

### Step 2: Update FeedRegenerationService

```typescript
// src/services/FeedRegenerationService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async regenerateUserFeed(userId: string, followingIds: string[]) {
  // 1. Fetch recent posts from database
  const posts = await prisma.post.findMany({
    where: {
      authorId: { in: followingIds },
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  // 2. Rebuild feed in Redis
  const feedKey = `feed:${userId}`;
  const pipeline = redisClient.multi();
  
  for (const post of posts) {
    pipeline.zAdd(feedKey, {
      score: post.createdAt.getTime(),
      value: post.id
    });
  }
  
  pipeline.expire(feedKey, 7 * 24 * 60 * 60);
  await pipeline.exec();
  
  console.log(`✅ Regenerated feed for ${userId} with ${posts.length} posts`);
}
```

### Step 3: Add Environment Variable

```env
# .env
POST_DATABASE_URL=postgresql://user:pass@post-db:5432/postdb
```

### Step 4: Cache Warming on Startup

```typescript
// src/index.ts
async function startServer() {
  await connectRedis();
  await startKafkaConsumer();
  
  // Optional: Warm cache for active users
  // await warmCacheForActiveUsers();
  
  app.listen(PORT, () => {
    console.log(`🚀 Feed Service running on port ${PORT}`);
  });
}
```

---

## ⚡ Performance Optimization

### Redis Persistence (Optional)

Enable Redis persistence to survive restarts:

```yaml
# docker-compose.yml
redis:
  image: redis:alpine
  command: redis-server --appendonly yes
  volumes:
    - redis-data:/data
  networks:
    - socialhub-network

volumes:
  redis-data:
```

**Pros:**
- Feeds survive container restarts
- No need to regenerate after restart

**Cons:**
- Slower writes
- More disk I/O

### Cache Warming Strategy

**Option 1: Active Users Only**
```javascript
// Warm cache only for users active in last 24 hours
const activeUsers = await getActiveUsers(24);
await batchRegenerateFeeds(activeUsers);
```

**Option 2: Scheduled Jobs**
```javascript
// Run every night at 2 AM
cron.schedule('0 2 * * *', async () => {
  await batchRegenerateFeeds(allUsers);
});
```

**Option 3: Lazy Loading (Current)**
- No upfront cost
- Regenerate only when needed
- User experiences small delay on first request

---

## 📊 Recovery Time Estimates

| Scenario | Recovery Method | Time per User | Notes |
|----------|----------------|---------------|-------|
| Single user request | Lazy loading | 50-200ms | Auto-regenerates on demand |
| 100 users | Batch regeneration | 5-20 seconds | Parallel processing |
| 10,000 users | Batch regeneration | 5-10 minutes | Background job recommended |
| Redis restart | Lazy loading | 0ms initial | Each user regenerates on first request |
| Redis restart + Cache warming | Batch regeneration | 10-30 minutes | Proactive rebuild |

---

## 🎓 Best Practices

### DO ✅
1. **Use lazy loading** for automatic recovery
2. **Cache following lists** to speed up regeneration
3. **Limit feed size** (100 posts max) to reduce memory
4. **Set TTLs** to prevent stale data (7 days)
5. **Monitor cache hit rates** to optimize strategy

### DON'T ❌
1. Don't regenerate all users at once (overload)
2. Don't skip error handling in regeneration
3. Don't fetch all posts ever (use time window)
4. Don't forget to update cache on follow/unfollow
5. Don't rely solely on cache without fallback

---

## 🔧 Monitoring & Alerts

### Key Metrics
```javascript
// Cache hit rate
const cacheHitRate = cacheHits / (cacheHits + cacheMisses);

// Alert if cache hit rate < 80%
if (cacheHitRate < 0.8) {
  console.warn('⚠️ Low cache hit rate, consider cache warming');
}
```

### Regeneration Logs
```
📭 Feed cache miss for user user123, attempting regeneration...
🔄 Regenerating feed for user user123...
✅ Regenerated feed for user123 with 45 posts
```

---

## 🎯 Summary

**If Redis cache is deleted, the feed system:**

1. ✅ **Automatically detects** cache miss on user request
2. ✅ **Fetches following list** from Users database  
3. ✅ **Queries recent posts** from Post database (last 7 days)
4. ✅ **Rebuilds feed** in Redis with proper timestamps
5. ✅ **Returns feed** to user seamlessly
6. ✅ **Caches result** for future requests

**User impact:** Small delay (50-200ms) on first request after cache loss. Subsequent requests are instant.

**Zero data loss** because source of truth is Post database, not Redis!

---

## 🔗 Integration Points

### With Post Service
- Post service emits `post.created` events
- Feed service automatically fans out to followers
- No direct API calls needed

### With Users Service
- Feed service needs follower list
- Option 1: Cache via `/cache-followers` endpoint
- Option 2: Direct database query (TODO)
- Option 3: Event-driven: consume follow events

### With Nginx Gateway
- Add feed routes to nginx.conf
- Enable authentication for feed endpoints
- Route `/feed/*` to feed service

### With Frontend
- Use GET /feed/:userId for timeline
- Implement infinite scroll with pagination
- Poll or use WebSocket for real-time updates

---

## 📊 Monitoring & Metrics

### Key Metrics to Track
1. **Kafka lag**: Consumer lag per topic
2. **Redis memory**: Cache memory usage
3. **Feed size**: Average posts per user feed
4. **Response time**: Feed retrieval latency
5. **Error rate**: Failed event processing

### Logging
```javascript
✅ Success logs: Green checkmark
❌ Error logs: Red X
📨 Event received: Envelope
🚀 Service started: Rocket
```

---

## 🚧 Future Enhancements

### 1. Follow Event Integration
```javascript
// Listen to FOLLOW_TOPIC
// When user follows someone:
// - Add their existing posts to new follower's feed
// - Update followers cache
```

### 2. Smart Feed Ranking
```javascript
// Beyond chronological + engagement:
// - User interests/preferences
// - Content type preferences
// - Time decay factor
// - Machine learning ranking
```

### 3. Feed Personalization
```javascript
// Filter by:
// - Content type (images, videos, text)
// - Hashtags
// - User preferences
```

### 4. Direct Users DB Integration
```javascript
// Instead of caching followers:
// - Direct Prisma queries to Users database
// - Real-time follower updates
```

---

## 📚 Technologies Used

- **Node.js + TypeScript**: Core runtime
- **Express.js**: REST API framework
- **KafkaJS**: Kafka client
- **Redis**: Cache & sorted sets
- **Docker**: Containerization
- **Nginx**: API Gateway

---

## 📖 Learn More

- [KafkaJS Documentation](https://kafka.js.org/)
- [Redis Sorted Sets](https://redis.io/docs/data-types/sorted-sets/)
- [Fan-out on Write Pattern](https://www.designgurus.io/blog/system-design-interview-fundamentals-fanout)
- [Building News Feeds](https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/news-feed-system)

---

## 🤝 Contributing

1. Follow existing code structure
2. Add tests for new features
3. Update this README for changes
4. Keep services decoupled

---

**Made with ❤️ for SocialHub Platform**

## 🎓 Summary

This feed service implements a **highly scalable, event-driven architecture** that:
- ✅ Consumes Kafka events in real-time
- ✅ Uses Redis for blazing-fast feed retrieval
- ✅ Implements Fan-out on Write for optimal read performance
- ✅ Supports horizontal scaling
- ✅ Tracks engagement for smarter ranking
- ✅ Integrates seamlessly with existing services

Perfect for building Instagram/Twitter-like feeds! 🚀
