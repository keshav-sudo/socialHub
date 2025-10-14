# Chat Service

## Overview
Real-time chat service supporting direct messaging, group chats, typing indicators, and message history. Uses WebSocket (Socket.IO) for real-time communication and Redis pub/sub for scalability.

## Features

- ✅ Real-time messaging with WebSocket (Socket.IO)
- ✅ Redis pub/sub for multi-instance support
- ✅ Chat rooms support (direct & group)
- ✅ Message history (stored in Redis & MongoDB)
- ✅ Typing indicators
- ✅ User join/leave notifications
- ✅ REST API for message history
- ✅ User presence tracking
- ✅ Event publishing to Notification Service

## Architecture

```
Client (WebSocket) → Chat Service → MongoDB (messages, rooms)
                                  → Redis (pub/sub, presence, cache)
                                  → RabbitMQ (publish message events)
                                  → Auth Service (gRPC - token validation)

Multi-Instance Support:
Client 1 → Socket.IO → Chat Instance 1 
                           ↓
                      Redis Pub/Sub
                           ↓
Client 2 ← Socket.IO ← Chat Instance 2
```

## Technology Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js + Socket.IO
- **Database**: MongoDB (messages, chat rooms)
- **Cache/PubSub**: Redis (presence, real-time delivery)
- **Message Queue**: RabbitMQ (event publishing)
- **Real-time**: Socket.IO (WebSocket with fallback)

## Port
- **5004**: HTTP + WebSocket Server

## Database Schema (MongoDB)

### Messages Collection
```javascript
{
  _id: ObjectId,
  roomId: String,          // Chat room ID
  userId: String,          // Sender user ID
  username: String,        // Sender username
  message: String,         // Message content
  messageType: String,     // 'text', 'image', 'file', 'system'
  timestamp: Date,
  createdAt: Date
}
```

### Rooms Collection
```javascript
{
  _id: ObjectId,
  roomId: String,          // Unique room identifier
  type: String,            // 'direct', 'group'
  participants: [String],  // Array of user IDs
  lastMessage: {
    content: String,
    timestamp: Date,
    senderId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

```env
# Server
PORT=5004
NODE_ENV=production

# MongoDB (if using persistent storage)
MONGODB_URI=mongodb://mongo:27017/chat_db

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_QUEUE_NEW_MESSAGE=new_message

# Socket.IO
CORS_ORIGIN=*
MAX_CONNECTIONS_PER_USER=5

# Message Storage
MAX_MESSAGE_HISTORY=1000
MESSAGE_HISTORY_TTL=604800  # 7 days
```

## API Endpoints (REST)

### 1. Get Message History
```http
GET /api/chat/:roomId/history?limit=50
Authorization: Bearer <token>

Response:
{
  "success": true,
  "messages": [
    {
      "roomId": "room-123",
      "userId": "user-uuid",
      "username": "john_doe",
      "message": "Hello!",
      "timestamp": 1697280000000
    }
  ]
}
```

### 2. Health Check
```http
GET /health

Response:
{
  "status": "ok",
  "service": "chat-service"
}
```

## Socket.IO Events

### Client → Server Events

#### 1. Authenticate
Authenticate the user connection before using other features.
```javascript
socket.emit('authenticate', {
  userId: 'user-uuid',
  username: 'john_doe'
});
```

#### 2. Join Room
Join a chat room to start receiving messages.
```javascript
socket.emit('join_room', {
  roomId: 'room-123'
});

// Server responds with:
socket.on('message_history', (messages) => {
  console.log('Chat history:', messages);
});

socket.on('room_users', (users) => {
  console.log('Users in room:', users);
});
```

#### 3. Leave Room
Leave a chat room.
```javascript
socket.emit('leave_room', {
  roomId: 'room-123'
});
```

#### 4. Send Message
Send a message to the room.
```javascript
socket.emit('send_message', {
  roomId: 'room-123',
  message: 'Hello everyone!'
});
```

#### 5. Typing Indicator
Notify others when you're typing.
```javascript
// Start typing
socket.emit('typing', {
  roomId: 'room-123',
  isTyping: true
});

// Stop typing
socket.emit('typing', {
  roomId: 'room-123',
  isTyping: false
});
```

### Server → Client Events

#### 1. New Message
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data);
  // {
  //   roomId: 'room-123',
  //   userId: 'user-uuid',
  //   username: 'jane_doe',
  //   message: 'Hi!',
  //   timestamp: 1697280000000
  // }
});
```

#### 2. Message History
Received when joining a room.
```javascript
socket.on('message_history', (messages) => {
  console.log('History:', messages);
});
```

#### 3. Room Users
Current users in the room.
```javascript
socket.on('room_users', (users) => {
  console.log('Room users:', users);
});
```

#### 4. User Joined
```javascript
socket.on('user_joined', (data) => {
  console.log('User joined:', data);
  // { roomId, userId, username }
});
```

#### 5. User Left
```javascript
socket.on('user_left', (data) => {
  console.log('User left:', data);
  // { roomId, userId, username }
});
```

#### 6. User Typing
```javascript
socket.on('user_typing', (data) => {
  console.log('User typing:', data);
  // { userId, username, isTyping }
});
```

#### 7. Error
```javascript
socket.on('error', (error) => {
  console.error('Error:', error);
  // { message: 'Not authenticated' }
});
```

## Testing

### Using REST API
```bash
TOKEN="your-jwt-token-here"

# Get chat history
curl -X GET "http://localhost/chat/room-123/history?limit=50" \
  -H "Authorization: Bearer $TOKEN"

# Health check
curl http://localhost:5004/health
```

### Using WebSocket Client (wscat)
```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c "ws://localhost:5004"

# Send events (as JSON):
{"event":"authenticate","data":{"userId":"user-123","username":"john"}}
{"event":"join_room","data":{"roomId":"room-123"}}
{"event":"send_message","data":{"roomId":"room-123","message":"Hello!"}}
```

### Using JavaScript/Node.js
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:5004');

socket.on('connect', () => {
  console.log('Connected');
  
  // Authenticate
  socket.emit('authenticate', {
    userId: 'user-123',
    username: 'john_doe'
  });
  
  // Join room
  socket.emit('join_room', { roomId: 'room-123' });
});

// Listen for messages
socket.on('new_message', (data) => {
  console.log('Message:', data);
});

// Send message
socket.emit('send_message', {
  roomId: 'room-123',
  message: 'Test message'
});
```

## Client Example

A complete HTML/JavaScript client example is available in `src/client-example.html`.

To test:
1. Open the HTML file in multiple browser windows
2. Fill in userId, username, and roomId
3. Click "Connect"
4. Start chatting between windows!

## Redis Usage

### Message History (List)
```
Key: chat:history:{roomId}
Type: List
Value: JSON message objects
Max Length: 1000 messages
TTL: 7 days
```

### Room Users (Set)
```
Key: chat:room:{roomId}:users
Type: Set
Value: User IDs
```

### User Presence (Hash)
```
Key: user:presence:{userId}
Fields: status, lastSeen, socketId
TTL: 1 hour
```

### Redis Pub/Sub Channels
```
Channel: chat:room:{roomId}
Purpose: Broadcasting messages across multiple service instances
```

## Event Publishing (RabbitMQ)

### New Message Event
Published to Notification Service for push notifications.

```json
{
  "eventType": "message.sent",
  "timestamp": "2024-10-14T06:30:00Z",
  "data": {
    "messageId": "msg-id",
    "roomId": "room-123",
    "senderId": "user-uuid",
    "receiverId": "user-uuid-2",
    "message": "Hello!",
    "timestamp": 1697280000000
  }
}
```

## Horizontal Scaling

Multiple chat service instances can run simultaneously using Redis pub/sub for synchronization.

### Load Balancer Configuration (Nginx)
```nginx
upstream chat_backend {
  ip_hash;  # Sticky sessions for Socket.IO
  server chat-service-1:5004;
  server chat-service-2:5004;
  server chat-service-3:5004;
}

server {
  location /socket.io/ {
    proxy_pass http://chat_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
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
