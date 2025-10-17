# 🏗️ Feed Service Architecture Explained

A visual guide to understanding how the Feed Service works.

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                          │
│                  GET /api/v1/feed?page=1&limit=20               │
│                  Authorization: Bearer <token>                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NGINX GATEWAY (Port 80)                     │
│  1. Validates JWT token                                          │
│  2. Calls Auth Service to verify user                            │
│  3. Adds x-user-payload header: {"id":"123","username":"john"}   │
│  4. Routes to Feed Service                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FEED SERVICE (Port 5005)                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Express App (src/index.ts)                                 │ │
│  │  • Middleware: JSON parser, CORS, Helmet                   │ │
│  │  • Routes: /api/v1/feed/*                                  │ │
│  │  • Error handling                                          │ │
│  └───────────────────────────┬────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Router (src/routes/feedRoutes.ts)                          │ │
│  │  • GET /          → getUserFeed()                          │ │
│  │  • GET /discover  → getDiscoverFeed()                      │ │
│  │  • GET /trending  → getTrendingFeed()                      │ │
│  └───────────────────────────┬────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Controller (src/controller/feedController.ts)              │ │
│  │  1. Extract user from x-user-payload header                │ │
│  │  2. Parse pagination parameters (page, limit)              │ │
│  │  3. Call service layer                                     │ │
│  │  4. Format response                                        │ │
│  │  5. Handle errors                                          │ │
│  └───────────────────────────┬────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Service Layer (src/services/feedService.ts)                │ │
│  │                                                            │ │
│  │  getPersonalizedFeed(userId, limit, offset):               │ │
│  │    1. Check Redis cache                                    │ │
│  │    2. If cache hit → return cached data                    │ │
│  │    3. If cache miss:                                       │ │
│  │       a. Get list of users being followed                  │ │
│  │       b. Get posts from those users                        │ │
│  │       c. Apply ranking algorithm                           │ │
│  │       d. Cache results (5 min TTL)                         │ │
│  │       e. Return posts                                      │ │
│  │                                                            │ │
│  └───────────────────────────┬────────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
    ┌───────────┐      ┌───────────┐      ┌───────────┐
    │   Redis   │      │PostgreSQL │      │ Ranking   │
    │  (Cache)  │      │ (Posts &  │      │ Service   │
    │           │      │  Follows) │      │           │
    │ Port 6379 │      │ Port 5432 │      │ (In-mem)  │
    └───────────┘      └───────────┘      └───────────┘
```

---

## 🔄 Request Flow Diagram (Detailed)

### Scenario: User wants to see their personalized feed

```
Step 1: CLIENT REQUEST
┌─────────────────────────────────────────┐
│ GET /api/v1/feed?page=1&limit=20        │
│ Headers:                                 │
│   Authorization: Bearer eyJhbG...       │
└────────────────┬────────────────────────┘
                 │
                 ▼
Step 2: GATEWAY AUTHENTICATION
┌─────────────────────────────────────────┐
│ Nginx Gateway                            │
│ • Intercepts request                     │
│ • Extracts JWT token                     │
│ • Calls Auth Service                     │
│ • Gets user data: {id, username, email}  │
│ • Adds x-user-payload header             │
└────────────────┬────────────────────────┘
                 │
                 ▼
Step 3: FEED SERVICE RECEIVES
┌─────────────────────────────────────────┐
│ Feed Service - Controller                │
│ • Reads x-user-payload                   │
│   User: {id: "user123", username: "..."}│
│ • Parses query params                    │
│   page: 1, limit: 20, offset: 0          │
└────────────────┬────────────────────────┘
                 │
                 ▼
Step 4: SERVICE LAYER - CHECK CACHE
┌─────────────────────────────────────────┐
│ feedService.getPersonalizedFeed()        │
│                                          │
│ cacheKey = "feed:user:user123:20:0"     │
│ Check Redis...                           │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    CACHE HIT         CACHE MISS
        │                 │
        ▼                 ▼
┌───────────┐     ┌──────────────────────┐
│Return     │     │Continue to database  │
│cached     │     │query (Step 5)        │
│data       │     │                      │
│(~2ms)     │     │                      │
└─────┬─────┘     └──────────┬───────────┘
      │                      │
      │                      ▼
      │            Step 5: GET FOLLOWING LIST
      │            ┌─────────────────────────┐
      │            │ prisma.follow.findMany() │
      │            │ WHERE:                   │
      │            │  followerId = "user123"  │
      │            │  isActive = true         │
      │            │                          │
      │            │ Result:                  │
      │            │  ["user456", "user789"]  │
      │            └──────────┬───────────────┘
      │                       │
      │                       ▼
      │            Step 6: GET POSTS FROM FOLLOWED USERS
      │            ┌─────────────────────────┐
      │            │ prisma.post.findMany()   │
      │            │ WHERE:                   │
      │            │  userId IN [user456,...]│
      │            │  visibility: public      │
      │            │ ORDER BY: createdAt DESC │
      │            │ LIMIT: 60 (3x requested) │
      │            │                          │
      │            │ Result: 45 posts         │
      │            └──────────┬───────────────┘
      │                       │
      │                       ▼
      │            Step 7: RANK POSTS
      │            ┌─────────────────────────┐
      │            │ rankingService.rankPosts│
      │            │                          │
      │            │ For each post:           │
      │            │  score = likes×1 +       │
      │            │          comments×2 +    │
      │            │          recencyBoost    │
      │            │                          │
      │            │ Sort by score DESC       │
      │            │ Take top 20              │
      │            └──────────┬───────────────┘
      │                       │
      │                       ▼
      │            Step 8: CACHE RESULTS
      │            ┌─────────────────────────┐
      │            │ redis.setex(            │
      │            │   "feed:user:...",      │
      │            │   300,  // 5 min TTL    │
      │            │   JSON.stringify(posts) │
      │            │ )                        │
      │            └──────────┬───────────────┘
      │                       │
      └───────────────────────┘
                 │
                 ▼
Step 9: RETURN TO CLIENT
┌─────────────────────────────────────────┐
│ Response:                                │
│ {                                        │
│   "success": true,                       │
│   "userId": "user123",                   │
│   "page": 1,                             │
│   "limit": 20,                           │
│   "count": 20,                           │
│   "posts": [                             │
│     {                                    │
│       "id": "post1",                     │
│       "userId": "user456",               │
│       "content": "...",                  │
│       "likes": 42,                       │
│       "comments": 5,                     │
│       "createdAt": "2024-01-15..."       │
│     },                                   │
│     ...                                  │
│   ]                                      │
│ }                                        │
└─────────────────────────────────────────┘

Total Time:
- With cache hit: ~5-10ms ✅
- With cache miss: ~100-300ms ✅
```

---

## 🧮 Ranking Algorithm Explained

### Visual Representation

```
Post A: "Just launched my app! 🚀"
┌─────────────────────────────────────┐
│ Created: 30 minutes ago             │
│ Likes: 50                           │
│ Comments: 10                        │
│                                     │
│ Calculation:                        │
│  Engagement = (50 × 1) + (10 × 2)   │
│             = 50 + 20 = 70          │
│                                     │
│  Recency Boost = 10 (< 1 hour old)  │
│                                     │
│  Total Score = 70 + 10 = 80         │
└─────────────────────────────────────┘

Post B: "Great day at the beach"
┌─────────────────────────────────────┐
│ Created: 3 hours ago                │
│ Likes: 100                          │
│ Comments: 5                         │
│                                     │
│ Calculation:                        │
│  Engagement = (100 × 1) + (5 × 2)   │
│             = 100 + 10 = 110        │
│                                     │
│  Recency Boost = 5 (< 6 hours old)  │
│                                     │
│  Total Score = 110 + 5 = 115        │
└─────────────────────────────────────┘

Post C: "Monday motivation"
┌─────────────────────────────────────┐
│ Created: 2 days ago                 │
│ Likes: 200                          │
│ Comments: 15                        │
│                                     │
│ Calculation:                        │
│  Engagement = (200 × 1) + (15 × 2)  │
│             = 200 + 30 = 230        │
│                                     │
│  Recency Boost = 0 (> 24 hours old) │
│                                     │
│  Total Score = 230 + 0 = 230        │
└─────────────────────────────────────┘

FINAL RANKING:
1st: Post C (Score: 230) - Highest engagement
2nd: Post B (Score: 115) - Good engagement + recent
3rd: Post A (Score: 80)  - Newer but less engagement
```

---

## 💾 Database Query Strategy

### Without Optimization (Bad)
```
┌─────────────────────────────────────┐
│ For each followed user:             │
│   Query: Get posts from user X      │
│   Query: Get posts from user Y      │
│   Query: Get posts from user Z      │
│   ...100 queries!                   │
└─────────────────────────────────────┘

Problem:
- 100 database queries
- Very slow (~5000ms)
- High database load
```

### With Optimization (Good)
```
┌─────────────────────────────────────┐
│ Single Query:                       │
│   Get posts WHERE userId IN         │
│     (user1, user2, ... user100)     │
│   ORDER BY createdAt DESC           │
│   LIMIT 60                          │
│                                     │
│ Result: 1 query, fast!              │
└─────────────────────────────────────┘

Benefits:
- 1 database query
- Fast (~50ms)
- Low database load
```

---

## 🔴 Caching Strategy

### Cache Keys Structure
```
feed:user:{userId}:{limit}:{offset}

Examples:
- feed:user:user123:20:0       (Page 1, 20 items)
- feed:user:user123:20:20      (Page 2, 20 items)
- feed:user:user456:10:0       (Different user)
```

### Cache Lifecycle
```
Time = 0s: Request arrives
    ↓
Cache Check → MISS
    ↓
Query Database (300ms)
    ↓
Cache Result (TTL: 300s)
    ↓
Return to User

Time = 1s: Same user, same page
    ↓
Cache Check → HIT ✅
    ↓
Return Cached Data (2ms) 🚀

Time = 301s: Cache expires
    ↓
Cache Check → MISS
    ↓
Query Database again
    ↓
Cache new results
```

### Cache Invalidation
```
User follows someone:
    ↓
Invalidate: feed:user:{userId}:*
    ↓
Next request will refresh

New post created:
    ↓
Option 1: Wait for cache to expire (simple)
Option 2: Invalidate all follower caches (complex)
```

---

## 🔀 Service Communication

### Within Feed Service
```
Client Request
    ↓
Controller (validates input)
    ↓
Service (business logic)
    ↓
    ├─→ Redis (cache check)
    ├─→ Database (query posts)
    └─→ Ranking Service (sort posts)
    ↓
Return Response
```

### With Other Services
```
Feed Service ←──────→ Users Service
             (shared database: Follow table)

Feed Service ←──────→ Post Service
             (shared database: Post table)

Feed Service ←──────→ Auth Service
             (via Gateway: user authentication)

Feed Service ───────→ Redis
             (caching)
```

---

## 📊 Performance Characteristics

### Response Times (95th percentile)

```
Scenario 1: Cache Hit
┌────────────────────────────────┐
│ Check Cache      : 2ms         │
│ Parse Data       : 1ms         │
│ Format Response  : 1ms         │
│ ────────────────────────       │
│ Total           : ~5ms ✅      │
└────────────────────────────────┘

Scenario 2: Cache Miss (20 posts)
┌────────────────────────────────┐
│ Check Cache      : 2ms         │
│ Query Follows    : 15ms        │
│ Query Posts      : 50ms        │
│ Rank Posts       : 5ms         │
│ Cache Results    : 3ms         │
│ Format Response  : 1ms         │
│ ────────────────────────       │
│ Total           : ~100ms ✅    │
└────────────────────────────────┘

Scenario 3: Cache Miss (100 posts)
┌────────────────────────────────┐
│ Check Cache      : 2ms         │
│ Query Follows    : 20ms        │
│ Query Posts      : 150ms       │
│ Rank Posts       : 20ms        │
│ Cache Results    : 5ms         │
│ Format Response  : 3ms         │
│ ────────────────────────       │
│ Total           : ~200ms ✅    │
└────────────────────────────────┘
```

### Cache Hit Ratio
```
Expected: 80-90%

Example with 1000 requests:
┌────────────────────────────────┐
│ Cache Hits   : 850 (85%)       │
│ Cache Misses : 150 (15%)       │
└────────────────────────────────┘

Benefit:
- 850 requests served in ~5ms each
- Only 150 requests hit database
- 80% reduction in database load
```

---

## 🎯 Key Design Decisions

### Why Redis for Caching?
```
✅ In-memory (sub-millisecond access)
✅ TTL support (auto-expiry)
✅ Simple key-value structure
✅ Easy to scale
❌ Alternative: Store in PostgreSQL
   (slower, adds load to primary database)
```

### Why Rank Posts?
```
✅ Better user experience (engaging content first)
✅ Keeps users on platform longer
✅ Balances recency and popularity
❌ Alternative: Chronological
   (simple but less engaging)
```

### Why Cache Per User?
```
✅ Each user has different following list
✅ Each user sees different content
✅ Can't share cache between users
❌ Alternative: Cache global feed
   (only works for public/trending feeds)
```

### Why Get 3x Posts Then Rank?
```
✅ Ensures enough variety after ranking
✅ Compensates for filtering
✅ Improves ranking quality
❌ Alternative: Get exact limit
   (might not have enough posts after ranking)
```

---

## 🔍 Debugging Guide

### Problem: Slow Response Times

```
Step 1: Check Cache
    ↓
Is cache hit ratio > 80%?
    │
    ├─ No: Cache not working
    │      → Check Redis connection
    │      → Check cache TTL
    │      → Check cache key generation
    │
    └─ Yes: Database query slow
           ↓
       Step 2: Check Database
           ↓
       Run EXPLAIN on queries
           ↓
       Are indexes being used?
           │
           ├─ No: Add indexes!
           │      CREATE INDEX ...
           │
           └─ Yes: Query too complex
                  → Optimize query
                  → Reduce data fetched
```

### Problem: Wrong Posts in Feed

```
Check 1: Following list
    ↓
Are we querying correct follows?
    WHERE followerId = X
    AND isActive = true
    AND isDeleted = false
    ↓
Check 2: Post visibility
    ↓
Are we filtering private posts?
    WHERE visibility IN ('public', 'followers')
    ↓
Check 3: Ranking algorithm
    ↓
Are scores calculated correctly?
    Log scores for each post
```

---

## 📝 Summary

The Feed Service is designed to:

1. **Aggregate** content from followed users
2. **Rank** posts using engagement + recency
3. **Cache** results for performance
4. **Paginate** for efficient delivery
5. **Scale** horizontally with stateless design

**Key Components:**
- Express.js for HTTP server
- Prisma for database access
- Redis for caching
- Custom ranking algorithm
- RESTful API design

**Performance Goals:**
- Cache hit: <10ms
- Cache miss: <200ms
- 80%+ cache hit ratio
- Support 1000+ req/sec per instance

---

**Next Steps:** Read [README.md](./README.md) for complete implementation guide!
