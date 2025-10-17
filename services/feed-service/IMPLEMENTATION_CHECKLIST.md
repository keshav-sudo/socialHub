# ✅ Feed Service Implementation Checklist

Use this checklist to track your progress as you implement the Feed Service. Check off each item as you complete it!

---

## Phase 1: Project Setup ⚙️

- [ ] **1.1** Initialize npm project (`npm init -y`)
- [ ] **1.2** Install all required dependencies
  - [ ] express, typescript, tsx
  - [ ] @prisma/client, prisma
  - [ ] dotenv, cors, helmet
  - [ ] ioredis
  - [ ] Type definitions (@types/*)
- [ ] **1.3** Create `tsconfig.json` with proper configuration
- [ ] **1.4** Create project folder structure
  - [ ] src/routes
  - [ ] src/controller
  - [ ] src/services
  - [ ] src/config
  - [ ] src/models (optional)
  - [ ] src/utils (optional)
- [ ] **1.5** Add scripts to `package.json`
  - [ ] `"dev": "tsx watch src/index.ts"`
  - [ ] `"build": "tsc"`
  - [ ] `"start": "node dist/index.js"`
- [ ] **1.6** Create `.env` file with required variables
  - [ ] PORT
  - [ ] DATABASE_URL
  - [ ] REDIS_HOST
  - [ ] REDIS_PORT
- [ ] **1.7** Add `.env` to `.gitignore`

**Test:** Run `npm run dev` - should show TypeScript compilation errors (expected, we haven't written code yet)

---

## Phase 2: Database Setup 💾

- [ ] **2.1** Create `prisma/schema.prisma`
- [ ] **2.2** Define User model
- [ ] **2.3** Define Follow model with proper indexes
- [ ] **2.4** Define Post model with proper indexes
- [ ] **2.5** Generate Prisma client (`npx prisma generate`)
- [ ] **2.6** Test database connection
  ```typescript
  const prisma = new PrismaClient();
  await prisma.$connect();
  console.log('✅ Database connected');
  ```

**Test:** Run `npx prisma studio` - should open database viewer

---

## Phase 3: Redis Configuration 🔴

- [ ] **3.1** Create `src/config/redis.ts`
- [ ] **3.2** Initialize Redis client with error handling
- [ ] **3.3** Implement `getCachedFeed()` function
- [ ] **3.4** Implement `cacheFeed()` function
- [ ] **3.5** Implement `invalidateUserFeed()` function
- [ ] **3.6** Add connection and error event handlers
- [ ] **3.7** Export Redis client

**Test:** Create a test file to verify Redis connection
```typescript
import { RedisClient } from './config/redis';
await RedisClient.set('test', 'hello');
const value = await RedisClient.get('test');
console.log(value); // Should print: hello
```

---

## Phase 4: Core Implementation - Entry Point 🚪

- [ ] **4.1** Create `src/index.ts`
- [ ] **4.2** Import required modules (express, cors, helmet, dotenv)
- [ ] **4.3** Initialize Express app
- [ ] **4.4** Add middleware
  - [ ] helmet() for security
  - [ ] cors() for CORS
  - [ ] express.json() for parsing
- [ ] **4.5** Create health check endpoint (`/health`)
- [ ] **4.6** Import and use feed routes
- [ ] **4.7** Add error handling middleware
- [ ] **4.8** Start server on correct port

**Test:** Run `npm run dev` and visit `http://localhost:5005/health`

---

## Phase 5: Routing Layer 🛣️

- [ ] **5.1** Create `src/routes/feedRoutes.ts`
- [ ] **5.2** Initialize Express Router
- [ ] **5.3** Define route: `GET /` (personalized feed)
- [ ] **5.4** Define route: `GET /discover` (discover feed)
- [ ] **5.5** Define route: `GET /trending` (trending feed)
- [ ] **5.6** Import controller functions
- [ ] **5.7** Export router

**Test:** Routes should be registered but return 404 (controllers not implemented yet)

---

## Phase 6: Controller Layer 🎮

- [ ] **6.1** Create `src/controller/feedController.ts`
- [ ] **6.2** Implement `getUserFeed()`
  - [ ] Extract user from `x-user-payload` header
  - [ ] Validate user exists
  - [ ] Parse pagination parameters (page, limit)
  - [ ] Call service method
  - [ ] Return formatted response
  - [ ] Add error handling
- [ ] **6.3** Implement `getDiscoverFeed()`
  - [ ] Similar structure to getUserFeed
  - [ ] Call different service method
- [ ] **6.4** Implement `getTrendingFeed()`
  - [ ] No authentication required
  - [ ] Parse pagination only
  - [ ] Call service method
- [ ] **6.5** Export all controller functions

**Test:** Endpoints should now respond (but with empty/error data - service not implemented)

---

## Phase 7: Service Layer - Feed Logic 🧠

- [ ] **7.1** Create `src/services/feedService.ts`
- [ ] **7.2** Import Prisma client and Redis functions
- [ ] **7.3** Create FeedService class
- [ ] **7.4** Implement `getPersonalizedFeed()`
  - [ ] Check cache first
  - [ ] On cache miss: get following list
  - [ ] Get posts from followed users
  - [ ] Apply ranking algorithm
  - [ ] Cache results
  - [ ] Return posts
- [ ] **7.5** Implement `getDiscoverFeed()`
  - [ ] Get following list
  - [ ] Query posts NOT from followed users
  - [ ] Order by engagement
  - [ ] Return posts
- [ ] **7.6** Implement `getTrendingFeed()`
  - [ ] Check cache
  - [ ] Query recent posts (last 7 days)
  - [ ] Order by likes + comments
  - [ ] Cache results
  - [ ] Return posts
- [ ] **7.7** Export FeedService

**Test:** Test each method independently
```typescript
const service = new FeedService();
const feed = await service.getPersonalizedFeed('user-id', 10, 0);
console.log(feed);
```

---

## Phase 8: Ranking Algorithm 📊

- [ ] **8.1** Create `src/services/rankingService.ts`
- [ ] **8.2** Create RankingService class
- [ ] **8.3** Implement `rankPosts()` with engagement + recency
  - [ ] Calculate age in hours
  - [ ] Calculate recency boost
  - [ ] Calculate engagement score
  - [ ] Calculate total score
  - [ ] Sort by score
- [ ] **8.4** Implement `rankChronological()` (bonus)
- [ ] **8.5** Implement `rankByEngagement()` (bonus)
- [ ] **8.6** Export RankingService

**Test:** Test ranking with sample data
```typescript
const service = new RankingService();
const posts = [/* sample posts */];
const ranked = service.rankPosts(posts, 'user-id');
console.log('First post:', ranked[0]);
```

---

## Phase 9: Testing & Validation ✅

### Manual Testing
- [ ] **9.1** Start all required services (postgres, redis, auth, users, posts)
- [ ] **9.2** Create test users
- [ ] **9.3** Make users follow each other
- [ ] **9.4** Create test posts
- [ ] **9.5** Test personalized feed
  ```bash
  curl -H "Authorization: Bearer TOKEN" \
    http://localhost:5005/api/v1/feed
  ```
- [ ] **9.6** Test discover feed
- [ ] **9.7** Test trending feed
- [ ] **9.8** Test pagination (page 1, 2, 3)
- [ ] **9.9** Test cache (hit same endpoint twice, check Redis)
- [ ] **9.10** Test error cases (invalid token, missing headers)

### Performance Testing
- [ ] **9.11** Check response times
  - [ ] With cache: < 50ms ✅
  - [ ] Without cache: < 500ms ✅
- [ ] **9.12** Verify cache hit rate
- [ ] **9.13** Check database query count

---

## Phase 10: Documentation 📝

- [ ] **10.1** Add inline code comments for complex logic
- [ ] **10.2** Document all public functions with JSDoc
  ```typescript
  /**
   * Get personalized feed for a user
   * @param userId - The ID of the user
   * @param limit - Number of posts to return
   * @param offset - Pagination offset
   * @returns Array of ranked posts
   */
  ```
- [ ] **10.3** Create API documentation (if not already in README)
- [ ] **10.4** Add example requests and responses
- [ ] **10.5** Document environment variables

---

## Phase 11: Integration (Optional) 🔗

- [ ] **11.1** Add Kafka consumer for real-time updates
  - [ ] Create `src/consumers/kafkaConsumer.ts`
  - [ ] Subscribe to USER_TOPIC
  - [ ] Subscribe to POST_TOPIC
  - [ ] Implement cache invalidation on events
- [ ] **11.2** Add Nginx configuration
  - [ ] Add route in gateway/nginx.conf
  - [ ] Configure proxy pass to feed service
- [ ] **11.3** Add to docker-compose.yml
  - [ ] Define feed-service container
  - [ ] Add dependencies (postgres, redis)
  - [ ] Add environment variables

---

## Phase 12: Optimization (Advanced) ⚡

- [ ] **12.1** Add database indexes if missing
  ```sql
  CREATE INDEX idx_post_user_created ON Post(userId, createdAt DESC);
  ```
- [ ] **12.2** Implement cursor-based pagination (better than offset)
- [ ] **12.3** Add feed pre-generation for active users
- [ ] **12.4** Implement different ranking algorithms
- [ ] **12.5** Add filtering options (hashtags, media type)
- [ ] **12.6** Add A/B testing for algorithms
- [ ] **12.7** Add analytics tracking

---

## Bonus Features 🎁

- [ ] **B.1** Add saved/bookmarked posts to feed
- [ ] **B.2** Add "hide post" functionality
- [ ] **B.3** Add "not interested" feedback
- [ ] **B.4** Implement ML-based ranking (TensorFlow.js)
- [ ] **B.5** Add content-based recommendations
- [ ] **B.6** Add trending hashtags endpoint
- [ ] **B.7** Add feed diversity (don't show same user twice in a row)

---

## Common Pitfalls to Avoid ⚠️

- [ ] ❌ Not checking cache first (defeats the purpose!)
- [ ] ❌ Returning private posts in discover/trending feeds
- [ ] ❌ Not handling empty following list case
- [ ] ❌ Not paginating (loading 10,000 posts at once)
- [ ] ❌ Not indexing database queries (slow performance)
- [ ] ❌ Not handling Redis connection errors
- [ ] ❌ Hardcoding values instead of using environment variables
- [ ] ❌ Not validating user authentication
- [ ] ❌ Exposing sensitive user data in responses

---

## Success Metrics 🎯

Your implementation is successful when:

- ✅ Service starts without errors
- ✅ All three feed types work (personalized, discover, trending)
- ✅ Pagination works correctly
- ✅ Caching reduces database queries by 80%+
- ✅ Response times are acceptable (<500ms)
- ✅ Ranking algorithm makes sense (recent + engagement)
- ✅ Error handling is robust
- ✅ Code is readable and well-documented

---

## Estimated Time ⏱️

- **Beginner Developer:** 8-12 hours
- **Intermediate Developer:** 4-6 hours
- **Advanced Developer:** 2-3 hours

**Tip:** Don't rush! Take breaks. Learn and understand each part.

---

## Need Help? 🆘

1. **Read the code comments** in the README examples
2. **Check other services** (post-service, users-service) for patterns
3. **Read LEARNING_GUIDE.md** for architecture understanding
4. **Google specific errors** with context
5. **Ask specific questions** with error messages and code snippets

---

## Celebration! 🎉

When you complete this checklist:

1. ✅ Mark all items as done
2. 🧪 Run full test suite
3. 📸 Take a screenshot of working endpoints
4. 📝 Write a reflection: What did you learn?
5. 🎓 Pat yourself on the back - you built a production-grade feed service!

---

**Remember:** This is a learning journey. The goal isn't just to complete it, but to **understand** it!

Good luck! 🚀
