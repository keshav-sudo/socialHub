# Chat Service - Complete Flow & Implementation Guide

## 📋 Overview
Real-time chat service with Socket.IO that allows users to chat only with their mutual followers. Authentication is handled by Nginx gateway, and follow relationships are checked using the Users database.

---

## 🏗️ Architecture Flow

```
Client Request
    ↓
Nginx Gateway (Auth Verification)
    ↓
x-user-payload Header Added
    ↓
Chat Service (Socket.IO / REST API)
    ↓
Follow Relationship Check (Users DB)
    ↓
Chat Allowed/Denied
```

---

## 🔐 Authentication Flow

### Step 1: Client Makes Request
```javascript
// Client sends request with Authorization header
Authorization: Bearer <jwt_token>
```

### Step 2: Nginx Authenticates
```
1. Nginx receives request
2. Makes internal call to /auth/verify
3. Gets user data from auth service
4. Sets x-user-payload header with user info
```

### Step 3: Chat Service Receives Request
```javascript
// Chat service reads x-user-payload header
const userPayload = JSON.parse(req.headers['x-user-payload']);
const userId = userPayload.id;
const username = userPayload.username;
```

**Important:** Chat service DOES NOT verify JWT tokens. Nginx handles all authentication.

---

## 💬 Chat Flow (Socket.IO)

### 1. Connect to Socket
```javascript
const socket = io('http://localhost/socket.io', {
  auth: {
    token: 'Bearer <jwt_token>'
  }
});
```

### 2. Join Room
```javascript
socket.emit('join_room', {
  roomId: 'room123',
  targetUserId: 'user456' // Optional: for one-to-one chat
});

// Server checks:
// ✓ User is authenticated (from nginx)
// ✓ Users follow each other (if targetUserId provided)
// ✓ Sends message history
```

### 3. Send Message
```javascript
socket.emit('send_message', {
  roomId: 'room123',
  message: 'Hello!',
  targetUserId: 'user456' // Optional
});

// Server checks:
// ✓ Follow relationship (if targetUserId provided)
// ✓ Saves message to Redis
// ✓ Broadcasts to room
```

### 4. Receive Messages
```javascript
socket.on('message', (data) => {
  console.log(data);
  // { roomId, userId, username, message, timestamp }
});

socket.on('message_history', (messages) => {
  console.log(messages); // Array of past messages
});
```

---

## 🔄 Follow Relationship Check

### Rule: Users can only chat if they follow each other

```javascript
// Example:
User A follows User B ✓
User B follows User A ✓
→ They can chat! ✓

User A follows User C ✓
User C does NOT follow User A ✗
→ They CANNOT chat! ✗
```

### How It Works:
```javascript
// followService.canUsersChat(userId1, userId2)
// 
// Checks in Users database:
// 1. Does userId1 follow userId2? (isActive=true, isDeleted=false)
// 2. Does userId2 follow userId1? (isActive=true, isDeleted=false)
// 
// Returns true only if BOTH follow each other
```

---

## 🛣️ REST API Endpoints

### 1. Get Chatable Users
```http
GET /chat/chatable-users/:userId
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "userId": "user123",
  "chatableUsers": ["user456", "user789"],
  "count": 2
}
```

### 2. Get Chat History
```http
GET /chat/:roomId/history?limit=50
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "messages": [
    {
      "roomId": "room123",
      "userId": "user123",
      "username": "john",
      "message": "Hello!",
      "timestamp": 1697500000000
    }
  ]
}
```

### 3. Send Message (REST)
```http
POST /chat/:roomId/message
Headers: Authorization: Bearer <token>
Body: {
  "message": "Hello!",
  "userId": "user123",
  "username": "john",
  "targetUserId": "user456" // Optional
}

Response:
{
  "success": true,
  "message": "Message sent",
  "data": { ... }
}
```

### 4. Get Room Users
```http
GET /chat/:roomId/users
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "roomId": "room123",
  "userCount": 2,
  "users": ["user123", "user456"]
}
```

### 5. Socket Info (Debug)
```http
GET /chat/socket-info

Response:
{
  "success": true,
  "totalConnections": 5,
  "connections": [...]
}
```

---

## 📁 Project Structure

```
chat-service/
├── src/
│   ├── index.ts                    # Main server file
│   ├── routes/
│   │   └── chatRoutes.ts          # All REST API routes
│   ├── controller/
│   │   └── chatController.ts      # Controller methods for routes
│   ├── services/
│   │   ├── chatService.ts         # Chat logic (Redis, Socket.IO)
│   │   └── followService.ts       # Follow relationship checks
│   ├── socket/
│   │   └── socketHandler.ts       # Socket.IO event handlers
│   └── config/
│       └── redis.ts               # Redis client configuration
├── prisma-chat/
│   └── schema.prisma              # Messages database (MongoDB)
├── prisma-users/
│   └── schema.prisma              # Users & Follow database (PostgreSQL)
└── generated/
    └── prisma/
        ├── client-chat/           # Generated Prisma client for chat
        └── client-users/          # Generated Prisma client for users
```

---

## 🗄️ Database Models

### Chat Database (MongoDB)
```prisma
model Message {
  id        String        @id @map("_id") @db.ObjectId
  roomId    String        @map("conversation_id")
  chatType  ChatType      @map("chat_type")
  senderId  String        @map("sender_id")
  targetId  String        @map("target_id")
  content   String
  timestamp DateTime      @default(now())
  status    MessageStatus @default(SENT)
}
```

### Users Database (PostgreSQL)
```prisma
model Follow {
  id          String   @id
  followerId  String   # User who follows
  followingId String   # User being followed
  isActive    Boolean  @default(true)
  isDeleted   Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model User {
  id       String @id
  username String @unique
}
```

---

## 🚀 Quick Start

### 1. Setup
```bash
cd chat-service
npm install
```

### 2. Generate Prisma Clients
```bash
npx prisma generate --schema=./prisma-chat/schema.prisma
npx prisma generate --schema=./prisma-users/schema.prisma
```

### 3. Build
```bash
npm run build
```

### 4. Run
```bash
npm start
```

---

## 🔧 Environment Variables

```env
# Server
PORT=5004

# MongoDB (Messages)
DATABASE_URL_1=mongodb://chat-db:27017/chatdb

# PostgreSQL (Users & Follow)
DATABASE_URL=postgresql://user:password@users-db:5432/usersdb

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# CORS
CORS_ORIGIN=*
```

---

## 🎯 Key Features

### ✅ Mutual Follow Check
- Users can only chat if they follow each other
- Checked on every join_room and send_message event
- Also checked in REST API endpoints

### ✅ No Internal Auth Calls
- Nginx handles authentication
- Chat service reads x-user-payload header
- No JWT verification in chat service

### ✅ Real-time Communication
- Socket.IO for instant messaging
- Redis pub/sub for multi-instance scaling
- Message history stored in Redis

### ✅ REST API Support
- Alternative to Socket.IO
- Same follow relationship checks
- Useful for testing and integrations

---

## 🧪 Testing Examples

### Test with curl:
```bash
# Get chatable users
curl -H "Authorization: Bearer <token>" \
  http://localhost/chat/chatable-users/user123

# Send message via REST
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","userId":"user123","username":"john","targetUserId":"user456"}' \
  http://localhost/chat/room123/message
```

### Test with Socket.IO client:
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost', {
  path: '/socket.io',
  auth: { token: 'Bearer <your_jwt_token>' }
});

socket.on('connect', () => {
  console.log('Connected!');
  
  socket.emit('join_room', {
    roomId: 'room123',
    targetUserId: 'user456'
  });
});

socket.on('message', (data) => {
  console.log('New message:', data);
});

socket.emit('send_message', {
  roomId: 'room123',
  message: 'Hello World!',
  targetUserId: 'user456'
});
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot chat with this user"
**Reason:** Users don't follow each other  
**Solution:** Both users must follow each other (mutual follow)

### Issue 2: "Authentication error: No user data"
**Reason:** Request not coming through Nginx  
**Solution:** Always use Nginx gateway URL (http://localhost/chat/...)

### Issue 3: Socket connection fails
**Reason:** Missing or invalid JWT token  
**Solution:** Include valid token in auth: { token: 'Bearer ...' }

### Issue 4: Messages not received in real-time
**Reason:** Not joined to room  
**Solution:** Emit 'join_room' event before sending messages

---

## 📊 Redis Data Structure

### Message History
```
Key: chat:history:${roomId}
Type: List
Value: JSON stringified message objects
Limit: Last 100 messages per room
```

### Room Users (Optional)
```
Key: room:${roomId}:users
Type: Set
Value: User IDs in the room
```

---

## 🔄 Scaling with Redis Adapter

The service uses Redis adapter for Socket.IO, enabling:
- Multiple chat service instances
- Load balancing across instances
- Shared state between instances
- Pub/sub for cross-instance messaging

```javascript
// Configured in index.ts
io.adapter(createAdapter(redisPublisher, redisSubscriber));
```

---

## 📝 Notes

1. **Room ID Format:** Can be anything, but recommended: `user1_user2` (sorted)
2. **Message Limit:** Redis stores last 100 messages per room
3. **WebSocket Fallback:** Socket.IO auto-falls back to polling if WebSocket fails
4. **CORS:** Currently set to `*`, configure properly for production

---

## 🤝 Integration with Other Services

### With Auth Service
- Nginx calls auth service for token verification
- Auth service returns user payload
- Chat service receives verified user data

### With Users Service
- Chat service reads Follow table from users database
- Uses Prisma client for users DB queries
- Checks mutual follow relationship

### With Frontend
- Frontend connects via Nginx gateway
- Uses Socket.IO client library
- Passes JWT token in connection auth

---

## 🎓 Learning Resources

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Redis Commands](https://redis.io/commands/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Nginx auth_request](http://nginx.org/en/docs/http/ngx_http_auth_request_module.html)

---

**Made with ❤️ for SocialHub Platform**
