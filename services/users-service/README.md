# Users Service

## Overview
Manages user profiles, follow/unfollow relationships, and user-related operations. Provides user information to other services via gRPC.

## Architecture

```
Client → Gateway → Users Service → PostgreSQL
                                 → Redis (cache)
                                 → Auth Service (gRPC - token validation)
```

## Technology Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (user profiles, relationships)
- **Cache**: Redis (user data cache, follower counts)
- **Communication**: REST API (external), gRPC (internal)

## Port
- **5003**: HTTP REST API
- **50053**: gRPC Server (internal)

## Database Schema (Prisma)

### User Model
```prisma
model User {
  id        String   @id 
  username  String?  @unique
  followers Follow[] @relation("UserFollowers")
  following Follow[] @relation("UserFollowing")
}
```

**Note**: User records are created "just-in-time" when follow operations occur. The user ID comes from the Auth service via JWT token.

### Follow Model
```prisma
model Follow {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  followerId  String
  follower    User     @relation("UserFollowing", fields: [followerId], references: [id])
  followingId String
  following   User     @relation("UserFollowers", fields: [followingId], references: [id])
  isActive    Boolean  @default(true)
  isDeleted   Boolean  @default(false)
  
  @@unique([followerId, followingId]) 
  @@index([followingId]) 
  @@index([followerId]) 
}
```

**Soft Delete**: The service uses `isActive` and `isDeleted` flags for soft deletion instead of hard deletes.

## API Endpoints

### All endpoints require authentication via JWT token in Authorization header

#### 1. Follow a User
```http
POST /api/v1/users/follow/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Successfully followed user",
  "follow": {
    "followerId": "current-user-uuid",
    "followingId": "target-user-uuid",
    "createdAt": "2024-10-14T06:30:00Z"
  }
}
```

#### 2. Unfollow a User
```http
POST /api/v1/users/unfollow/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Successfully unfollowed user"
}
```

#### 3. Get Following List
```http
GET /api/v1/users/following/list?page=1&limit=20
Authorization: Bearer <token>

Response:
{
  "success": true,
  "following": [
    {
      "id": "user-uuid",
      "username": "john_doe",
      "fullName": "John Doe",
      "avatarUrl": "https://...",
      "bio": "Software Developer",
      "followedAt": "2024-10-14T06:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### 4. Get Followers List
```http
GET /api/v1/users/followers/list?page=1&limit=20
Authorization: Bearer <token>

Response:
{
  "success": true,
  "followers": [
    {
      "id": "user-uuid",
      "username": "jane_smith",
      "fullName": "Jane Smith",
      "avatarUrl": "https://...",
      "bio": "Designer",
      "followedAt": "2024-10-14T06:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 200,
    "totalPages": 10
  }
}
```

#### 5. Get Follow Counts
```http
GET /api/v1/users/counts
Authorization: Bearer <token>

Response:
{
  "success": true,
  "counts": {
    "followers": 200,
    "following": 150,
    "posts": 45
  }
}
```

#### 6. Get User Profile (Future)
```http
GET /api/v1/users/profile/:username
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "fullName": "John Doe",
    "bio": "Software Developer | Tech Enthusiast",
    "avatarUrl": "https://...",
    "coverUrl": "https://...",
    "location": "San Francisco, CA",
    "website": "https://johndoe.com",
    "createdAt": "2024-01-15T08:00:00Z",
    "stats": {
      "followers": 200,
      "following": 150,
      "posts": 45
    },
    "isFollowing": true,
    "isFollower": false
  }
}
```

#### 7. Update User Profile (Future)
```http
PATCH /api/v1/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe Jr.",
  "bio": "Updated bio",
  "location": "New York, NY",
  "website": "https://newsite.com"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

## gRPC Service (Internal)

**Note**: gRPC is currently NOT implemented in this service. All communication is done via REST API and Kafka events.

### Future gRPC Implementation
```protobuf
service UserService {
  rpc GetUserById (UserIdRequest) returns (UserResponse);
  rpc GetUsersByIds (UserIdsRequest) returns (UsersResponse);
  rpc GetFollowers (UserIdRequest) returns (UserIdsResponse);
  rpc GetFollowing (UserIdRequest) returns (UserIdsResponse);
  rpc IsFollowing (FollowCheckRequest) returns (FollowCheckResponse);
}

message UserIdRequest {
  string userId = 1;
}

message UserResponse {
  string id = 1;
  string username = 2;
  string email = 3;
  string fullName = 4;
  string avatarUrl = 5;
  string bio = 6;
}
```

## Environment Variables

```env
# Server
PORT=5003
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@postgres:5432/users_db

# Kafka
KAFKA_BROKER=kafka:9092
KAFKA_CLIENT_ID=users-service

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

## Testing APIs

### Using cURL

```bash
# Save token from auth service
TOKEN="your-jwt-token-here"

# 1. Follow a user
curl -X POST http://localhost/users/follow/user-uuid-here \
  -H "Authorization: Bearer $TOKEN"

# 2. Unfollow a user
curl -X POST http://localhost/users/unfollow/user-uuid-here \
  -H "Authorization: Bearer $TOKEN"

# 3. Get following list
curl -X GET "http://localhost/users/following/list?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# 4. Get followers list
curl -X GET "http://localhost/users/followers/list?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# 5. Get follow counts
curl -X GET http://localhost/users/counts \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Create a collection for Users Service
2. Set environment variables:
   - `base_url`: `http://localhost`
   - `token`: JWT token from auth service
3. Add Authorization header: `Bearer {{token}}`

## Redis Caching Strategy

### User Profile Cache
```
Key: user:profile:{userId}
Value: JSON user object
TTL: 1 hour
```

### Follow Counts Cache
```
Key: user:counts:{userId}
Value: {followers, following, posts}
TTL: 5 minutes
```

### Followers List Cache
```
Key: user:followers:{userId}:{page}
Value: JSON array of follower objects
TTL: 10 minutes
```

### Following List Cache
```
Key: user:following:{userId}:{page}
Value: JSON array of following objects
TTL: 10 minutes
```

## Business Logic

### Follow Operation
1. Validate target user exists
2. Check if already following (prevent duplicates)
3. Check if following self (prevent)
4. Insert into `follows` table
5. Increment follower/following counts in cache and DB
6. Publish event to notification service
7. Return success response

### Unfollow Operation
1. Validate relationship exists
2. Delete from `follows` table
3. Decrement follower/following counts in cache and DB
4. Return success response

## Event Publishing (Kafka)

### Follow Event
Published to `USER_TOPIC` when a user follows someone.

```json
{
  "eventType": "follow.created",
  "timestamp": "2024-10-14T06:30:00Z",
  "data": {
    "authorId": "user-uuid",
    "followingId": "target-user-uuid",
    "newfollower": "john_doe",
    "followedUsername": "jane_doe"
  }
}
```

**Consumer**: Notification Service (to notify the followed user)

### Unfollow Event
Published to `USER_TOPIC` when a user unfollows someone.

```json
{
  "eventType": "unfollow.created",
  "timestamp": "2024-10-14T06:30:00Z",
  "data": {
    "user_id": "user-uuid",
    "following_id": "target-user-uuid"
  }
}
```

### Kafka Configuration
```typescript
const kafka = new Kafka({
  clientId: 'users-service',
  brokers: ['kafka:9092'],
  retry: { retries: 5 }
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner
});
```

## Performance Optimization

- **Caching**: Redis cache for user profiles and counts
- **Pagination**: Cursor-based pagination for large lists
- **Database Indexes**: On follower_id and following_id
- **Batch Operations**: Bulk fetch for multiple users via gRPC
- **Connection Pooling**: PostgreSQL connection pool (max 20)

## Security

- **Authentication**: All endpoints require valid JWT
- **Authorization**: Users can only follow/unfollow as themselves
- **Rate Limiting**: 100 requests per minute per user
- **Input Validation**: Validate user IDs and pagination params

## Error Codes

- **400**: Bad Request (invalid user ID, pagination)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found (user not found)
- **409**: Conflict (already following, trying to follow self)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error

## Monitoring & Health Check

```bash
# Health check endpoint
curl http://localhost:5003/health

Response:
{
  "status": "ok",
  "service": "users-service",
  "timestamp": "2024-10-14T06:30:00Z",
  "database": "connected",
  "redis": "connected"
}
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Run in production
npm start

# Run tests
npm test

# Run database migrations
npx prisma migrate dev
```

## Docker

```bash
# Build image
docker build -t users-service .

# Run container
docker run -p 5003:5003 --env-file .env users-service
```

## Dependencies

```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "ioredis": "^5.3.2",
  "@prisma/client": "^5.7.0",
  "@grpc/grpc-js": "^1.9.13",
  "joi": "^17.11.0",
  "dotenv": "^16.3.1"
}
```

## Database Queries Optimization

### Get Followers with User Details
```sql
SELECT 
  u.id, u.username, u.full_name, u.avatar_url, u.bio,
  f.created_at as followed_at
FROM follows f
JOIN users u ON u.id = f.follower_id
WHERE f.following_id = $1
ORDER BY f.created_at DESC
LIMIT $2 OFFSET $3;
```

### Get Following with User Details
```sql
SELECT 
  u.id, u.username, u.full_name, u.avatar_url, u.bio,
  f.created_at as followed_at
FROM follows f
JOIN users u ON u.id = f.following_id
WHERE f.follower_id = $1
ORDER BY f.created_at DESC
LIMIT $2 OFFSET $3;
```

## Future Enhancements

- User search functionality
- Mutual followers/following
- Block/mute users
- User recommendations (suggested follows)
- Profile analytics
- Privacy settings
- Verification badges
- User activity feed
