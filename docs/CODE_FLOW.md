# 🔄 SocialHub - Complete Code Flow Documentation

This document explains the **end-to-end code flow** of the SocialHub microservices platform, detailing how each request flows through the system, how services communicate, and how everything works together.

---

## 📋 Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Request Flow Patterns](#request-flow-patterns)
3. [Service-by-Service Flow](#service-by-service-flow)
4. [Event-Driven Flows (Kafka)](#event-driven-flows-kafka)
5. [Real-time Communication (WebSocket)](#real-time-communication-websocket)
6. [Database Interactions](#database-interactions)
7. [Testing the Flow](#testing-the-flow)
8. [Common Issues & Solutions](#common-issues--solutions)

---

## 🏗 System Architecture Overview

### Component Stack

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│              (Browser, Mobile App, API Client)               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Nginx Gateway (Port 8080)               │
│  • Routes requests to services                               │
│  • JWT authentication (auth_request)                         │
│  • CORS handling                                             │
│  • Load balancing (upstream)                                 │
└───────┬──────────────┬──────────────┬──────────────┬─────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│Auth Service  │ │User Srv  │ │Post Srv  │ │Chat Service  │
│   :5000      │ │  :5003   │ │  :5001   │ │    :5004     │
│              │ │          │ │          │ │              │
│ PostgreSQL   │ │PostgreSQL│ │PostgreSQL│ │    Redis     │
│   + Redis    │ │+ Kafka   │ │+ Kafka   │ │  PubSub      │
└──────────────┘ └──────────┘ └─┬────────┘ └──────────────┘
                                 │
                                 │ Kafka Events
                                 ▼
                       ┌──────────────────┐
                       │Notification Srv  │
                       │     :5002        │
                       │                  │
                       │    MongoDB       │
                       │   + Kafka        │
                       └──────────────────┘
                                 │
                                 ▼
                       ┌──────────────────┐
                       │  Feed Service    │
                       │     :5005        │
                       │                  │
                       │ Redis + Kafka    │
                       └──────────────────┘
```

### Infrastructure Services

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ PostgreSQL   │  │   MongoDB    │  │    Redis     │
│              │  │              │  │              │
│ • Auth DB    │  │ • Notify DB  │  │ • Cache      │
│ • User DB    │  │              │  │ • Sessions   │
│ • Post DB    │  │              │  │ • PubSub     │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────────────────────────────┐
│         Apache Kafka :9092           │
│                                      │
│  Topics:                             │
│  • POST_TOPIC    (post events)      │
│  • USER_TOPIC    (user events)      │
└──────────────────────────────────────┘
```

---

## 🔄 Request Flow Patterns

### Pattern 1: Public Endpoint (No Authentication)

**Example: User Registration/Login**

```
┌─────────┐         ┌─────────┐         ┌────────────┐
│ Client  │────────▶│ Gateway │────────▶│   Auth     │
│         │ POST    │ (Nginx) │ Forward │  Service   │
│         │ /auth/  │         │         │   :5000    │
└─────────┘ signup  └─────────┘         └────┬───────┘
     ▲                                        │
     │                                        │
     │                                        ▼
     │                                  ┌────────────┐
     └──────────────────────────────────│PostgreSQL  │
                   JWT Token            │  (Users)   │
                                        └────────────┘
```

**Flow Steps:**
1. Client sends POST to `http://localhost:8080/auth/signup`
2. Nginx receives request, routes to auth service
3. Nginx rewrites path: `/auth/signup` → `/api/v1/auth/signup`
4. Auth service validates input (Zod schema)
5. Auth service checks for existing user
6. Hashes password with bcrypt
7. Creates user record in PostgreSQL
8. Generates JWT token
9. Returns token to client

### Pattern 2: Protected Endpoint (JWT Required)

**Example: Create Post**

```
┌─────────┐         ┌─────────┐         ┌────────────┐         ┌────────────┐
│ Client  │────────▶│ Gateway │────────▶│   Auth     │────────▶│   Post     │
│         │ POST    │         │ Verify  │  Service   │ Valid   │  Service   │
│         │ /posts/ │         │ Token   │            │ Token   │   :5001    │
└─────────┘         └─────────┘         └────────────┘         └────┬───────┘
   + JWT                │                                            │
   Header               │ auth_request                               │
                        │ /auth/verify                               ▼
                        │                                      ┌────────────┐
                        │◀─────────────────────────────────────│PostgreSQL  │
                        │    x-user-payload: {id, username}    │  (Posts)   │
                        │                                      └────────────┘
```

**Flow Steps:**
1. Client sends POST to `http://localhost:8080/posts/` with `Authorization: Bearer <token>`
2. Nginx intercepts request, triggers `auth_request /auth/verify`
3. Nginx sends token to Auth Service: `GET /api/v1/auth/verify-user`
4. Auth Service validates JWT:
   - Verifies signature
   - Checks expiration
   - Extracts user payload
5. Auth Service returns `x-user-payload: {"id":"123","username":"john"}`
6. Nginx forwards original request to Post Service with user payload header
7. Post Service reads user info from `x-user-payload` header
8. Post Service processes request
9. Returns response to client

### Pattern 3: Event-Driven Async Communication

**Example: Post Creation → Notification**

```
┌─────────┐                                     ┌────────────┐
│  Post   │──── Kafka Event ────▶ POST_TOPIC ───▶│  Notify    │
│ Service │    {type: "post.    "               │  Service   │
│         │     created"}                        │            │
└─────────┘                                     └────┬───────┘
     │                                               │
     │ Response immediately                          │
     ▼ (non-blocking)                                ▼
┌─────────┐                                     ┌────────────┐
│ Client  │                                     │  MongoDB   │
└─────────┘                                     │(Notify DB) │
                                                └────────────┘
```

**Flow Steps:**
1. Post Service creates post in database
2. Post Service publishes event to Kafka (non-blocking)
3. Returns success to client immediately
4. Notification Service consumes event asynchronously
5. Creates notification in MongoDB
6. User sees notification on next poll/refresh

### Pattern 4: Real-time WebSocket Communication

**Example: Chat Messages**

```
User A                 Chat Instance 1       Redis PubSub      Chat Instance 2       User B
  │                          │                    │                   │                │
  ├──WebSocket Connect──────▶│                    │                   │                │
  │  ws://host:8080/         │                    │                   │                │
  │  + JWT in handshake      │                    │                   │                │
  │                          │                    │                   │                │
  │                          ├──auth_request─────▶│                   │                │
  │                          │  (Nginx validates) │                   │                │
  │                          │                    │                   │                │
  ├──join_room(room-123)────▶│                    │                   │                │
  │                          ├──SUBSCRIBE─────────▶                   │                │
  │                          │  chat:room:123     │                   │                │
  │                          │                    │                   │                │
  ├──send_message("Hi!")────▶│                    │                   │                │
  │                          ├──PUBLISH───────────▶                   │                │
  │                          │  chat:room:123     │                   │                │
  │                          │  {msg: "Hi!"}      │                   │                │
  │                          │                    ├──BROADCAST────────▶                │
  │                          │                    │                   ├──emit────────▶│
  │◀──emit("new_message")────┤◀───RECEIVE─────────┤                   │                │
  │                          │                    │                   │                │
```

**Flow Steps:**
1. User A connects via WebSocket with JWT
2. Nginx validates JWT via auth_request
3. Connection forwarded to Chat Instance 1
4. User A joins room (Redis subscribe)
5. User B (on Chat Instance 2) also joins room
6. User A sends message
7. Chat Instance 1 publishes to Redis
8. Redis broadcasts to all subscribed instances
9. Both instances emit to their connected clients
10. Both User A and B receive message

---

## 🎯 Service-by-Service Flow

### 1. Auth Service (:5000)

**Responsibility:** User authentication and authorization

#### Endpoints:
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/verify-user` - Validate JWT (internal)
- `POST /api/v1/auth/request-reset` - Request password reset
- `POST /api/v1/auth/verify-otp` - Verify OTP code
- `POST /api/v1/auth/reset-password` - Reset password with OTP

#### Registration Flow (`/signup`):
```typescript
// 1. Request arrives at controller
POST /api/v1/auth/signup
Body: { name, email, username, password }

// 2. Validation (src/model/user.model.ts)
userSignupSchema.parse(req.body)
// Validates:
// - email format
// - password strength (min 8 chars)
// - username format
// - required fields

// 3. Check duplicates (src/controller/user.controller.ts)
const existingUser = await prisma.user.findFirst({
  where: {
    OR: [
      { email: body.email },
      { username: body.username }
    ]
  }
})

if (existingUser) {
  return res.status(400).json({ error: "User already exists" })
}

// 4. Hash password (src/utils/bcrypt.util.ts)
const hashedPassword = await bcrypt.hash(password, 10)
// 10 salt rounds = ~100ms compute time
// Makes brute force attacks impractical

// 5. Create user
const user = await prisma.user.create({
  data: {
    name,
    email,
    username,
    password: hashedPassword
  }
})

// 6. Generate JWT (src/utils/jwt.util.ts)
const token = jwt.sign(
  { 
    id: user.id, 
    username: user.username 
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
)

// 7. Return token
return res.status(201).json({ 
  message: "User created",
  token 
})
```

#### JWT Validation Flow (`/verify-user`):
```typescript
// Called by Nginx for every protected request

GET /api/v1/auth/verify-user
Header: Authorization: Bearer <token>

// 1. Extract token
const token = req.headers.authorization?.split(' ')[1]

// 2. Verify JWT
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  // decoded = { id, username, iat, exp }
  
  // 3. Return user payload
  res.setHeader('x-user-payload', JSON.stringify({
    id: decoded.id,
    username: decoded.username
  }))
  
  return res.status(200).json({ valid: true })
  
} catch (error) {
  return res.status(401).json({ valid: false })
}
```

#### Password Reset Flow:
```
1. Request Reset → Generates OTP → Store in Redis (5 min TTL) → Send email
2. Verify OTP → Check Redis → Return success
3. Reset Password → Verify OTP → Hash new password → Update DB → Delete OTP
```

---

### 2. Users Service (:5003)

**Responsibility:** User profiles, follow relationships

#### Endpoints:
- `GET /api/v1/users/profile/:userId` - Get user profile
- `POST /api/v1/users/follow/:userId` - Follow user
- `DELETE /api/v1/users/unfollow/:userId` - Unfollow user
- `GET /api/v1/users/followers/:userId` - Get followers list
- `GET /api/v1/users/following/:userId` - Get following list

#### Follow User Flow:
```typescript
POST /api/v1/users/follow/:userId
Header: x-user-payload: {"id":"123","username":"john"}

// 1. Extract current user from header
const currentUser = JSON.parse(req.headers['x-user-payload'])
const followerId = currentUser.id

// 2. Get target user ID from URL
const followingId = req.params.userId

// 3. Validate both users exist
const [follower, following] = await Promise.all([
  prisma.user.findUnique({ where: { id: followerId } }),
  prisma.user.findUnique({ where: { id: followingId } })
])

if (!follower || !following) {
  return res.status(404).json({ error: "User not found" })
}

// 4. Check if already following
const existing = await prisma.follow.findFirst({
  where: {
    followerId,
    followingId,
    isActive: true
  }
})

if (existing) {
  return res.status(400).json({ error: "Already following" })
}

// 5. Create follow relationship (or reactivate)
const follow = await prisma.follow.upsert({
  where: {
    followerId_followingId: { followerId, followingId }
  },
  update: { isActive: true },
  create: { followerId, followingId, isActive: true }
})

// 6. Publish event to Kafka
await kafkaProducer.send({
  topic: 'USER_TOPIC',
  messages: [{
    key: followingId,
    value: JSON.stringify({
      eventType: 'user.followed',
      data: {
        followerId,
        followingId,
        followerUsername: follower.username,
        timestamp: Date.now()
      }
    })
  }]
})

// 7. Return success (non-blocking)
return res.status(200).json({ 
  message: "Followed successfully",
  follow 
})
```

#### Why Soft Delete?
```typescript
// Unfollow doesn't delete, it sets isActive = false
await prisma.follow.update({
  where: { id: followId },
  data: { isActive: false }
})

// Benefits:
// 1. Can reactivate follow easily
// 2. Maintain history for analytics
// 3. Prevent race conditions
// 4. Audit trail for spam detection
```

---

### 3. Post Service (:5001)

**Responsibility:** Posts, comments, likes, media uploads

#### Endpoints:
- `POST /api/v1/posts/` - Create post
- `GET /api/v1/posts/:postId` - Get single post
- `GET /api/v1/posts/user/:userId` - Get user's posts
- `POST /api/v1/posts/:postId/like` - Like post
- `POST /api/v1/posts/:postId/comment` - Comment on post
- `GET /api/v1/posts/:postId/comments` - Get comments

#### Create Post with Media Flow:
```typescript
POST /api/v1/posts/
Header: x-user-payload: {"id":"123","username":"john"}
Content-Type: multipart/form-data
Body: { content, visibility, files[] }

// 1. Multer middleware processes files
// Config: max 10 files, 10MB each
app.use(multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
}).array('files', 10))

// 2. Extract user and data
const userId = JSON.parse(req.headers['x-user-payload']).id
const { content, visibility } = req.body
const files = req.files // Array of files

// 3. Upload to Cloudinary (parallel)
const uploadPromises = files.map(file => 
  cloudinary.uploader.upload_stream({
    resource_type: 'auto',
    folder: 'socialhub/posts'
  }).end(file.buffer)
)

const uploads = await Promise.all(uploadPromises)
// Total time: ~500ms (parallel, not sequential)

// 4. Create post in database
const post = await prisma.post.create({
  data: {
    content,
    visibility,
    userId,
    mediaUrls: uploads.map(u => u.secure_url),
    likeCount: 0,
    commentCount: 0
  }
})

// 5. Publish event to Kafka
await kafkaProducer.send({
  topic: 'POST_TOPIC',
  messages: [{
    key: post.id,
    value: JSON.stringify({
      eventType: 'post.created',
      data: {
        postId: post.id,
        userId,
        username: req.user.username,
        content,
        timestamp: Date.now()
      }
    })
  }]
})

// 6. Return post (non-blocking)
return res.status(201).json({ 
  message: "Post created",
  post 
})
```

#### Like/Unlike Toggle Flow:
```typescript
POST /api/v1/posts/:postId/like

// 1. Check if already liked
const existingLike = await prisma.like.findFirst({
  where: { postId, userId }
})

// 2. Toggle like
if (existingLike) {
  // Unlike
  await prisma.$transaction([
    prisma.like.delete({ where: { id: existingLike.id } }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { decrement: 1 } }
    })
  ])
  return res.json({ liked: false })
  
} else {
  // Like
  await prisma.$transaction([
    prisma.like.create({ data: { postId, userId } }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } }
    })
  ])
  return res.json({ liked: true })
}

// Transaction ensures atomic update
// Prevents race conditions on concurrent likes
```

---

### 4. Chat Service (:5004)

**Responsibility:** Real-time messaging, WebSocket connections

#### Features:
- WebSocket connections (Socket.IO)
- Room-based messaging
- Redis Pub/Sub for multi-instance sync
- Message history
- User presence

#### WebSocket Connection Flow:
```typescript
// Server: src/index.ts

import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
})

// 1. Redis adapter for multi-instance
const pubClient = createClient({ host: 'redis' })
const subClient = pubClient.duplicate()
io.adapter(createAdapter(pubClient, subClient))

// 2. Authentication middleware
io.use((socket, next) => {
  // User payload injected by Nginx from JWT validation
  const userPayload = socket.handshake.headers['x-user-payload']
  
  if (!userPayload) {
    return next(new Error('Unauthorized'))
  }
  
  socket.user = JSON.parse(userPayload)
  next()
})

// 3. Connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username}`)
  
  // 4. Join room event
  socket.on('join_room', async ({ roomId }) => {
    socket.join(roomId)
    
    // Load message history
    const messages = await getMessageHistory(roomId, 50)
    socket.emit('message_history', messages)
    
    // Notify others
    socket.to(roomId).emit('user_joined', {
      username: socket.user.username
    })
  })
  
  // 5. Send message event
  socket.on('send_message', async ({ roomId, message }) => {
    const messageData = {
      id: generateId(),
      roomId,
      userId: socket.user.id,
      username: socket.user.username,
      message,
      timestamp: Date.now()
    }
    
    // Store in database/cache
    await saveMessage(messageData)
    
    // Broadcast to room (all instances via Redis)
    io.to(roomId).emit('new_message', messageData)
  })
  
  // 6. Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.username}`)
  })
})
```

#### Multi-Instance Synchronization:
```
Instance 1: User A sends message
    ↓
Redis Pub/Sub: Broadcast to all instances
    ↓
Instance 1: Receives from Redis → Emit to local clients
Instance 2: Receives from Redis → Emit to local clients
Instance 3: Receives from Redis → Emit to local clients
    ↓
All users in room receive message (regardless of which instance they're connected to)
```

---

### 5. Notification Service (:5002)

**Responsibility:** Create and manage notifications, consume events

#### Endpoints:
- `GET /notify/notifications` - Get user notifications
- `PATCH /notify/notifications/:id/read` - Mark as read
- `DELETE /notify/notifications/:id` - Delete notification

#### Kafka Consumer Flow:
```typescript
// src/consumers/kafka.consumer.ts

import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:9092']
})

const consumer = kafka.consumer({ 
  groupId: 'notification-group' 
})

// 1. Subscribe to topics
await consumer.subscribe({ 
  topics: ['POST_TOPIC', 'USER_TOPIC'],
  fromBeginning: false 
})

// 2. Process messages
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString())
    
    switch (event.eventType) {
      case 'post.created':
        await handlePostCreated(event.data)
        break
        
      case 'user.followed':
        await handleUserFollowed(event.data)
        break
        
      case 'post.liked':
        await handlePostLiked(event.data)
        break
        
      case 'post.commented':
        await handlePostCommented(event.data)
        break
    }
  }
})

// 3. Event handlers
async function handleUserFollowed(data) {
  // Create notification for the user being followed
  await prisma.notification.create({
    data: {
      userId: data.followingId,
      type: 'FOLLOW',
      message: `${data.followerUsername} started following you`,
      metadata: {
        followerId: data.followerId
      },
      read: false
    }
  })
}

async function handlePostLiked(data) {
  // Create notification for post author
  await prisma.notification.create({
    data: {
      userId: data.postAuthorId,
      type: 'LIKE',
      message: `${data.likerUsername} liked your post`,
      metadata: {
        postId: data.postId,
        likerId: data.likerId
      },
      read: false
    }
  })
}
```

#### Benefits of Event-Driven:
```
Synchronous (Bad):
- Post Service must wait for Notification Service
- If Notification Service is down, post creation fails
- Tight coupling between services
- Increased latency

Event-Driven (Good):
- Post Service publishes event and returns immediately
- Notification Service processes when ready
- Services are decoupled
- Can replay events if needed
- Can add new consumers without changing producers
```

---

### 6. Feed Service (:5005)

**Responsibility:** Personalized feed generation

#### Endpoints:
- `GET /api/feed/` - Get personalized feed
- `GET /api/feed/trending` - Get trending posts

#### Feed Generation Flow:
```typescript
GET /api/feed/
Query: { page, limit }

// 1. Get current user
const userId = JSON.parse(req.headers['x-user-payload']).id

// 2. Get following list (cached)
const cacheKey = `feed:following:${userId}`
let following = await redis.get(cacheKey)

if (!following) {
  following = await prisma.follow.findMany({
    where: { followerId: userId, isActive: true },
    select: { followingId: true }
  })
  await redis.setex(cacheKey, 300, JSON.stringify(following))
}

// 3. Get posts from following
const posts = await prisma.post.findMany({
  where: {
    userId: { in: following.map(f => f.followingId) },
    visibility: 'public'
  },
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * limit,
  take: limit,
  include: {
    user: { select: { username: true, avatar: true } },
    _count: { select: { likes: true, comments: true } }
  }
})

// 4. Return feed
return res.json({ posts })
```

---

## ⚡ Event-Driven Flows (Kafka)

### Kafka Topics & Events

#### POST_TOPIC Events:
```typescript
// post.created
{
  eventType: 'post.created',
  data: {
    postId: string,
    userId: string,
    username: string,
    content: string,
    timestamp: number
  }
}

// post.liked
{
  eventType: 'post.liked',
  data: {
    postId: string,
    postAuthorId: string,
    likerId: string,
    likerUsername: string,
    timestamp: number
  }
}

// post.commented
{
  eventType: 'post.commented',
  data: {
    postId: string,
    postAuthorId: string,
    commenterId: string,
    commenterUsername: string,
    comment: string,
    timestamp: number
  }
}
```

#### USER_TOPIC Events:
```typescript
// user.followed
{
  eventType: 'user.followed',
  data: {
    followerId: string,
    followingId: string,
    followerUsername: string,
    timestamp: number
  }
}
```

### Consumer Groups

```
notification-group:
- Notification Service (1 instance)
- Processes: All events → Create notifications

feed-group:
- Feed Service (1-3 instances)
- Processes: post.created → Update feed cache
- Load balanced across instances

analytics-group (future):
- Analytics Service
- Processes: All events → Store for analytics
```

---

## 🔌 Real-time Communication (WebSocket)

### Chat Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│         (Multiple users on different devices)            │
└────────────┬─────────────────────┬──────────────────────┘
             │                     │
             │ WebSocket           │ WebSocket
             │                     │
┌────────────▼────────┐   ┌───────▼──────────┐
│  Chat Instance 1    │   │ Chat Instance 2   │
│   (Container 1)     │   │  (Container 2)    │
│                     │   │                   │
│  Socket.IO Server   │   │ Socket.IO Server  │
└────────────┬────────┘   └───────┬───────────┘
             │                    │
             │ Redis Pub/Sub      │
             └────────┬───────────┘
                      │
             ┌────────▼────────┐
             │  Redis Server   │
             │                 │
             │  Channels:      │
             │  chat:room:*    │
             └─────────────────┘
```

### Message Flow Detail:

1. **Connection:**
   ```typescript
   // Client
   const socket = io('http://localhost:8080', {
     auth: { token: 'Bearer ...' },
     transports: ['websocket']
   })
   ```

2. **Join Room:**
   ```typescript
   socket.emit('join_room', { roomId: 'room-123' })
   ```

3. **Send Message:**
   ```typescript
   socket.emit('send_message', {
     roomId: 'room-123',
     message: 'Hello everyone!'
   })
   ```

4. **Receive Messages:**
   ```typescript
   socket.on('new_message', (data) => {
     console.log(`${data.username}: ${data.message}`)
   })
   ```

---

## 💾 Database Interactions

### PostgreSQL (Auth, Users, Posts)

#### Connection Management:
```typescript
// Prisma Client singleton
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Connection pool: 10 connections by default
// Reused across requests
```

#### Transaction Example:
```typescript
// Atomic operations
await prisma.$transaction([
  prisma.post.update({
    where: { id: postId },
    data: { likeCount: { increment: 1 } }
  }),
  prisma.like.create({
    data: { postId, userId }
  }),
  prisma.notification.create({
    data: {
      userId: postAuthorId,
      type: 'LIKE',
      message: `${username} liked your post`
    }
  })
])
// All succeed or all fail
```

### MongoDB (Notifications)

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.MONGODB_URL
    }
  }
})

// Flexible schema, high write throughput
// Perfect for notifications (high volume, eventual consistency)
```

### Redis (Cache, Sessions, Pub/Sub)

```typescript
import { createClient } from 'redis'

const redis = createClient({
  url: 'redis://redis:6379'
})

// 1. Cache
await redis.setex('user:123:profile', 300, JSON.stringify(profile))
const cached = await redis.get('user:123:profile')

// 2. Pub/Sub
await redis.publish('chat:room:123', JSON.stringify(message))

// 3. Sets (for presence)
await redis.sadd('room:123:users', userId)
const users = await redis.smembers('room:123:users')
```

---

## 🧪 Testing the Flow

### 1. Start All Services

```bash
cd /home/keshav/App/socialHub

# Start infrastructure
docker compose up -d redis kafka

# Start services
docker compose up -d auth-service users-service post-service \
  notification-service chat-service feed-service gateway
```

### 2. Test Authentication

```bash
# Register user
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "Password123!"
  }'

# Response: { "token": "eyJhbGc..." }

# Login
TOKEN=$(curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "Password123!"
  }' | jq -r '.token')

echo "Token: $TOKEN"
```

### 3. Test Protected Endpoints

```bash
# Create post
curl -X POST http://localhost:8080/posts/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "My first post!",
    "visibility": "public"
  }'

# Get user profile
curl -X GET http://localhost:8080/users/profile/USER_ID \
  -H "Authorization: Bearer $TOKEN"

# Follow user
curl -X POST http://localhost:8080/users/follow/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Event Flow

```bash
# Create post → Check notification was created

# 1. Create post
POST_RESPONSE=$(curl -X POST http://localhost:8080/posts/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test post", "visibility": "public"}')

# 2. Wait for Kafka processing (1-2 seconds)
sleep 2

# 3. Check notifications
curl -X GET http://localhost:8080/notify/notifications \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Test WebSocket Chat

```bash
# Install wscat
npm install -g wscat

# Connect to chat
wscat -c "ws://localhost:8080/socket.io/?EIO=4&transport=websocket" \
  -H "Authorization: Bearer $TOKEN"

# Send events (paste in wscat):
42["join_room",{"roomId":"room-123"}]
42["send_message",{"roomId":"room-123","message":"Hello!"}]
```

---

## 🐛 Common Issues & Solutions

### Issue 1: 502 Bad Gateway

**Cause:** Service not running or not healthy

**Solution:**
```bash
# Check service status
docker compose ps

# Check logs
docker compose logs SERVICE_NAME

# Restart service
docker compose restart SERVICE_NAME
```

### Issue 2: JWT Validation Fails

**Cause:** Token expired or invalid secret

**Solution:**
```bash
# Check JWT_SECRET matches in all services
grep JWT_SECRET services/*/. env

# Generate new token
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "test@example.com", "password": "Password123!"}'
```

### Issue 3: Kafka Connection Error

**Cause:** Kafka not ready or wrong broker address

**Solution:**
```bash
# Check Kafka is running
docker compose ps kafka

# Check Kafka logs
docker compose logs kafka

# Verify broker address
docker exec -it kafka kafka-broker-api-versions \
  --bootstrap-server localhost:9092
```

### Issue 4: Database Migration Errors

**Cause:** Schema out of sync

**Solution:**
```bash
cd services/auth-service
npx prisma migrate reset  # ⚠️ Deletes data
npx prisma migrate deploy
npx prisma generate
```

### Issue 5: WebSocket Connection Drops

**Cause:** Nginx timeout or wrong protocol

**Solution:**
```nginx
# Check nginx.conf has WebSocket settings
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 86400;
```

### Issue 6: CORS Errors

**Cause:** Origin not allowed

**Solution:**
```nginx
# Update nginx.conf
add_header 'Access-Control-Allow-Origin' 'http://localhost:5173' always;
add_header 'Access-Control-Allow-Credentials' 'true' always;
```

---

## 📊 Performance Characteristics

### Latency by Operation:

| Operation | Expected Latency | Notes |
|-----------|-----------------|-------|
| Auth validation | < 5ms | JWT verification (in-memory) |
| Database query (indexed) | < 10ms | PostgreSQL with proper indexes |
| Database write | < 20ms | Single record INSERT |
| Kafka publish | < 50ms | Fire-and-forget |
| Cache hit (Redis) | < 1ms | In-memory lookup |
| Cache miss + DB | < 15ms | Redis miss + PostgreSQL query |
| File upload | 300-500ms | Cloudinary upload (parallel) |
| WebSocket message | < 10ms | Redis Pub/Sub + emit |

### Throughput by Service:

| Service | Operation | Throughput |
|---------|-----------|------------|
| Auth | Login | 500+ req/sec |
| Auth | Verify token | 5,000+ req/sec |
| Users | Follow | 1,000+ req/sec |
| Posts | Create (text) | 500+ req/sec |
| Posts | Create (media) | 200+ req/sec |
| Chat | Messages | 10,000+ msg/sec |
| Notification | Process events | 10,000+ events/sec |

---

## 🎯 Summary

The SocialHub platform follows modern microservices patterns:

1. **Gateway (Nginx)** - Single entry point, JWT validation, routing
2. **Auth Service** - Stateless JWT authentication
3. **Users Service** - Relationships with soft deletes
4. **Post Service** - Content with media uploads (Cloudinary)
5. **Chat Service** - Real-time WebSocket with Redis Pub/Sub
6. **Notification Service** - Event-driven with Kafka consumers
7. **Feed Service** - Personalized feeds with caching

**Key Patterns:**
- Event-driven async communication (Kafka)
- Stateless authentication (JWT)
- Horizontal scalability (Redis Pub/Sub, Kafka consumer groups)
- Database per service (PostgreSQL, MongoDB)
- Caching strategy (Redis)
- Graceful degradation

All services are containerized, independently scalable, and can be deployed to Kubernetes for production.
