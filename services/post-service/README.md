# Post Service

## Overview
Manages posts, comments, likes/dislikes, and media uploads. Publishes events to Feed and Notification services for real-time updates.

## Architecture

```
Client → Gateway → Post Service → MongoDB (posts, comments, likes)
                                → S3 (media files)
                                → Redis (cache)
                                → Kafka (publish post events)
                                → Auth Service (gRPC - token validation)
```

## Technology Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL via Prisma (not MongoDB)
- **Storage**: Cloudinary (not S3/MinIO)
- **Cache**: Redis (planned, not yet implemented)
- **Message Queue**: Kafka (event publishing)
- **File Upload**: Multer (multipart/form-data)

## Port
- **5001**: HTTP REST API

## Database Schema (MongoDB)

### Posts Collection
```javascript
{
  _id: ObjectId,
  userId: String,        // User who created the post
  username: String,
  content: String,       // Post text content
  mediaUrls: [String],   // Array of S3 URLs
  mediaTypes: [String],  // ['image', 'video']
  likes: Number,         // Like count
  dislikes: Number,      // Dislike count
  commentsCount: Number,
  visibility: String,    // 'public', 'followers', 'private'
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Comments Collection
```javascript
{
  _id: ObjectId,
  postId: String,        // Reference to post
  userId: String,
  username: String,
  content: String,
  likes: Number,
  parentCommentId: String,  // For nested comments
  createdAt: Date,
  updatedAt: Date
}
```

### Likes Collection
```javascript
{
  _id: ObjectId,
  postId: String,
  userId: String,
  type: String,          // 'like' or 'dislike'
  createdAt: Date
}
```

## API Endpoints

### All endpoints require authentication

#### 1. Test Endpoint
```http
GET /api/v1/posts/test
Authorization: Bearer <token>

Response:
{
  "message": "Post service is working"
}
```

#### 2. Create Post
```http
POST /api/v1/posts/
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- content: "Post text content"
- file[]: [File1, File2, ...]  // Max 10 files
- tags: ["tag1", "tag2"]
- visibility: "public"

Response:
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "_id": "post-id",
    "userId": "user-uuid",
    "username": "john_doe",
    "content": "Post text content",
    "mediaUrls": [
      "https://s3.amazonaws.com/bucket/file1.jpg",
      "https://s3.amazonaws.com/bucket/file2.jpg"
    ],
    "mediaTypes": ["image", "image"],
    "likes": 0,
    "dislikes": 0,
    "commentsCount": 0,
    "visibility": "public",
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-10-14T06:30:00Z"
  }
}
```

#### 3. Get All Posts (Feed)
```http
GET /api/v1/posts/getall?page=1&limit=20&sort=recent
Authorization: Bearer <token>

Query Parameters:
- page: Page number (default: 1)
- limit: Posts per page (default: 20, max: 100)
- sort: 'recent' | 'trending' | 'popular'

Response:
{
  "success": true,
  "posts": [
    {
      "_id": "post-id",
      "userId": "user-uuid",
      "username": "john_doe",
      "content": "Post content",
      "mediaUrls": ["url1", "url2"],
      "likes": 150,
      "dislikes": 5,
      "commentsCount": 20,
      "createdAt": "2024-10-14T06:30:00Z",
      "isLiked": true,
      "isDisliked": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### 4. Get Single Post
```http
GET /api/v1/posts/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "post": {
    "_id": "post-id",
    "userId": "user-uuid",
    "username": "john_doe",
    "userAvatar": "url",
    "content": "Post content",
    "mediaUrls": ["url1"],
    "mediaTypes": ["image"],
    "likes": 150,
    "dislikes": 5,
    "commentsCount": 20,
    "tags": ["tag1", "tag2"],
    "visibility": "public",
    "createdAt": "2024-10-14T06:30:00Z",
    "isLiked": true,
    "isDisliked": false
  }
}
```

#### 5. Update Post
```http
PATCH /api/v1/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated content",
  "visibility": "followers",
  "tags": ["new-tag"]
}

Response:
{
  "success": true,
  "message": "Post updated successfully",
  "post": { /* updated post object */ }
}
```

#### 6. Delete Post
```http
DELETE /api/v1/posts/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Post deleted successfully"
}
```

#### 7. Add Comment
```http
POST /api/v1/posts/comment/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post!",
  "parentCommentId": "optional-parent-id"  // For nested comments
}

Response:
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "_id": "comment-id",
    "postId": "post-id",
    "userId": "user-uuid",
    "username": "jane_doe",
    "content": "Great post!",
    "likes": 0,
    "createdAt": "2024-10-14T06:30:00Z"
  }
}
```

#### 8. Get Comments
```http
GET /api/v1/posts/comment/:id?page=1&limit=20
Authorization: Bearer <token>

Response:
{
  "success": true,
  "comments": [
    {
      "_id": "comment-id",
      "postId": "post-id",
      "userId": "user-uuid",
      "username": "jane_doe",
      "userAvatar": "url",
      "content": "Great post!",
      "likes": 5,
      "replies": [],  // Nested comments
      "createdAt": "2024-10-14T06:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### 9. Update Comment
```http
PATCH /api/v1/posts/comment/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment text"
}

Response:
{
  "success": true,
  "message": "Comment updated successfully",
  "comment": { /* updated comment object */ }
}
```

#### 10. Delete Comment
```http
DELETE /api/v1/posts/comment/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

#### 11. Like Post
```http
POST /api/v1/posts/like/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Post liked successfully",
  "likes": 151,
  "dislikes": 5
}
```

#### 12. Dislike Post (Toggle Like to Dislike)
```http
PATCH /api/v1/posts/like/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Post disliked successfully",
  "likes": 150,
  "dislikes": 6
}
```

## Environment Variables

```env
# Server
PORT=5001
NODE_ENV=production

# Database (PostgreSQL via Prisma)
DATABASE_URL=postgresql://user:password@postgres:5432/posts_db

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Kafka
KAFKA_BROKER=kafka:9092
KAFKA_CLIENT_ID=post-service

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
MAX_FILES=10

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

## Testing APIs

### Using cURL

```bash
TOKEN="your-jwt-token-here"

# 1. Create post with text only
curl -X POST http://localhost/posts/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "content=Hello World! This is my first post" \
  -F "visibility=public"

# 2. Create post with media
curl -X POST http://localhost/posts/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "content=Check out this image!" \
  -F "file=@/path/to/image.jpg" \
  -F "file=@/path/to/image2.jpg" \
  -F "tags=photography" \
  -F "tags=nature"

# 3. Get all posts
curl -X GET "http://localhost/posts/getall?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# 4. Get single post
curl -X GET http://localhost/posts/post-id-here \
  -H "Authorization: Bearer $TOKEN"

# 5. Update post
curl -X PATCH http://localhost/posts/post-id-here \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated content","visibility":"followers"}'

# 6. Delete post
curl -X DELETE http://localhost/posts/post-id-here \
  -H "Authorization: Bearer $TOKEN"

# 7. Add comment
curl -X POST http://localhost/posts/comment/post-id-here \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Great post!"}'

# 8. Get comments
curl -X GET "http://localhost/posts/comment/post-id-here?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# 9. Like post
curl -X POST http://localhost/posts/like/post-id-here \
  -H "Authorization: Bearer $TOKEN"

# 10. Dislike post
curl -X PATCH http://localhost/posts/like/post-id-here \
  -H "Authorization: Bearer $TOKEN"
```

## Event Publishing (Kafka)

### Post Created Event
Published to `POST_TOPIC` topic.

```json
{
  "eventType": "post.created",
  "timestamp": "2024-10-14T06:30:00Z",
  "data": {
    "postId": "post-id",
    "authorId": "user-uuid",
    "username": "john_doe"
  }
}
```

### Comment Created Event
Published to `POST_TOPIC` topic.

```json
{
  "eventType": "comment.created",
  "timestamp": "2024-10-14T06:30:00Z",
  "data": {
    "commentId": "comment-id",
    "postId": "post-id",
    "authorId": "commenter-uuid",
    "recipientId": "post-owner-uuid",
    "authorUsername": "jane_doe",
    "createdAt": "2024-10-14T06:30:00Z"
  }
}
```

### Like Created Event
Published to `POST_TOPIC` topic.

```json
{
  "eventType": "like.created",
  "timestamp": "2024-10-14T06:30:00Z",
  "data": {
    "likeId": "like-id",
    "postId": "post-id",
    "authorId": "liker-uuid",
    "recipientId": "post-owner-uuid"
  }
}
```

**Consumers:**
- **Notification Service**: Creates notifications for post owners

### Kafka Producer Configuration
```typescript
const kafka = new Kafka({
  clientId: 'post-service',
  brokers: ['kafka:9092'],
  retry: { retries: 5 }
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner
});
```

## Redis Caching

### Post Cache
```
Key: post:{postId}
Value: JSON post object
TTL: 10 minutes
```

### User Posts Cache
```
Key: posts:user:{userId}:{page}
Value: JSON array of posts
TTL: 5 minutes
```

### Trending Posts Cache
```
Key: posts:trending
Value: JSON array of post IDs
TTL: 15 minutes
```

## File Upload Configuration

### Multer Setup
```javascript
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

### S3 Upload Flow
1. Receive file in memory buffer
2. Generate unique filename: `{userId}/{timestamp}-{random}.{ext}`
3. Upload to S3 bucket
4. Get public URL
5. Store URL in MongoDB
6. Delete memory buffer

## Security

- **Authentication**: All endpoints require valid JWT
- **Authorization**: Users can only edit/delete their own posts
- **File Validation**: Type, size, and content validation
- **Rate Limiting**: 50 post creations per hour per user
- **Content Moderation**: Profanity filter (future)
- **XSS Protection**: Sanitize user content

## Error Codes

- **400**: Bad Request (invalid data, file type)
- **401**: Unauthorized (invalid token)
- **403**: Forbidden (not post owner)
- **404**: Not Found (post/comment not found)
- **413**: Payload Too Large (file size exceeded)
- **429**: Too Many Requests (rate limit)
- **500**: Internal Server Error

## Performance Optimization

- **Pagination**: Cursor-based for infinite scroll
- **Caching**: Redis cache for hot posts
- **CDN**: S3/CloudFront for media delivery
- **Database Indexes**: On userId, createdAt, likes
- **Lazy Loading**: Load media on demand
- **Compression**: Gzip response compression

## Monitoring & Health Check

```bash
curl http://localhost:5001/health

Response:
{
  "status": "ok",
  "service": "post-service",
  "timestamp": "2024-10-14T06:30:00Z",
  "database": "connected",
  "redis": "connected",
  "s3": "connected",
  "kafka": "connected"
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
```

## Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "ioredis": "^5.3.2",
  "kafkajs": "^2.2.4",
  "multer": "^1.4.5-lts.1",
  "aws-sdk": "^2.1498.0",
  "@grpc/grpc-js": "^1.9.13",
  "joi": "^17.11.0",
  "sharp": "^0.33.0"
}
```

## Future Enhancements

- Post scheduling
- Video transcoding
- Image compression and thumbnails
- Post analytics (views, engagement)
- Hashtag trending
- Post templates
- Polls and surveys
- Location tagging
- Mention users in posts
- Share/repost functionality
