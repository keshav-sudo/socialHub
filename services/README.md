# SocialHub Services - Complete Flow Guide

## 📋 Overview
This document explains how all services work together in the SocialHub platform. Read this to understand the complete flow without looking at code.

---

## 🏗️ System Architecture

```
                    Client (Browser/Mobile)
                            |
                            ↓
                    [Nginx Gateway :80]
                            |
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   [Auth Service]    [Post Service]    [Chat Service]
     :5000              :5001              :5004
        ↓                   ↓                   ↓
   [Users DB]          [Posts DB]         [Chat DB]
   PostgreSQL          PostgreSQL          MongoDB
```

---

## 🔐 Complete Authentication Flow

### Step 1: User Login
```
1. User sends credentials to /auth/login
   POST http://localhost/auth/login
   Body: { "email": "user@test.com", "password": "pass123" }

2. Nginx routes to Auth Service (no auth required)
   → http://auth-service:5000/api/v1/auth/login

3. Auth Service:
   - Validates credentials
   - Checks user in Users Database
   - Generates JWT token
   - Returns token + user info

4. Client receives:
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "user123",
       "username": "john",
       "email": "user@test.com"
     }
   }

5. Client stores token (localStorage/cookie)
```

### Step 2: Using Protected Resources
```
1. User wants to create a post
   POST http://localhost/posts/create
   Headers: Authorization: Bearer <token>
   Body: { "content": "Hello World!" }

2. Nginx receives request:
   a. Triggers auth_request → /auth/verify
   b. Calls Auth Service internally:
      GET http://auth-service:5000/api/v1/auth/verify-user
      Headers: Authorization: Bearer <token>
   
3. Auth Service verifies token:
   - Decodes JWT
   - Checks signature
   - Checks expiration
   - Returns user data in header:
     x-user-payload: {"id":"user123","username":"john"}

4. Nginx receives verification:
   - If 200 OK: Proceeds to post service
   - If 401: Returns error to client

5. Nginx forwards to Post Service:
   POST http://post-service:5001/api/v1/posts/create
   Headers: x-user-payload: {"id":"user123","username":"john"}
   Body: { "content": "Hello World!" }

6. Post Service:
   - Reads x-user-payload header (NO token verification!)
   - Knows user is authenticated (Nginx verified)
   - Uses user.id to create post
   - Saves to Posts Database

7. Response flows back:
   Post Service → Nginx → Client
```

---

## 💬 Chat Service Flow

### Flow 1: Getting Chatable Users
```
1. User wants to see who they can chat with
   GET http://localhost/chat/chatable-users/user123
   Headers: Authorization: Bearer <token>

2. Nginx authenticates (auth_request)
   → Auth Service verifies token
   → Nginx gets user payload

3. Nginx forwards to Chat Service:
   GET http://chat-service:5004/api/chat/chatable-users/user123
   Headers: x-user-payload: {...}

4. Chat Service (FollowService):
   a. Queries Users Database (PostgreSQL)
   b. Finds users that user123 follows
   c. Finds users that follow user123 back
   d. Returns intersection (mutual follows)

5. Response:
   {
     "success": true,
     "chatableUsers": ["user456", "user789"],
     "count": 2
   }
```

### Flow 2: Real-time Chat with Socket.IO
```
1. User connects to Socket.IO
   const socket = io('http://localhost', {
     path: '/socket.io',
     auth: { token: 'Bearer <jwt>' }
   });

2. Socket.IO handshake:
   GET http://localhost/socket.io/?transport=polling
   Headers: Authorization: Bearer <token>

3. Nginx authenticates:
   a. auth_request to Auth Service
   b. Gets user payload
   c. Upgrades to WebSocket
   d. Forwards to Chat Service with user payload

4. Chat Service receives connection:
   - Reads x-user-payload header
   - Stores userId & username in socket.data
   - Connection established!

5. User joins a chat room:
   socket.emit('join_room', {
     roomId: 'room123',
     targetUserId: 'user456'
   });

6. Chat Service processes join:
   a. FollowService checks: Do they follow each other?
   b. Query Users DB:
      - Does user123 follow user456? ✓
      - Does user456 follow user123? ✓
   c. If YES: Join room
   d. If NO: Emit error
   e. Load message history from Redis
   f. Send history to user

7. User sends a message:
   socket.emit('send_message', {
     roomId: 'room123',
     message: 'Hello!',
     targetUserId: 'user456'
   });

8. Chat Service processes message:
   a. Check follow relationship again
   b. Save to Redis (message history)
   c. Publish to Redis pub/sub
   d. Broadcast to all users in room
   e. All connected instances receive via Redis

9. Other users receive:
   socket.on('message', (data) => {
     // { roomId, userId, username, message, timestamp }
   });
```

---

## 🔄 Complete Request Flow (Detailed)

### Example: User Creates a Post

```
Step 1: CLIENT REQUEST
--------
POST http://localhost/posts/create
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
Body:
  { "content": "My first post!", "images": ["url1.jpg"] }

↓

Step 2: NGINX GATEWAY
--------
- Receives request on port 80
- Matches location /posts/
- Sees auth_request directive
- Makes internal subrequest to /auth/verify

↓

Step 3: AUTH SUBREQUEST
--------
Internal Call:
  GET http://auth-service:5000/api/v1/auth/verify-user
  Headers: Authorization: Bearer eyJhbGc...

Auth Service:
  - Decodes JWT
  - Validates signature with SECRET_KEY
  - Checks expiration
  - Queries Users DB for user
  - Returns 200 OK with header

Response:
  HTTP/1.1 200 OK
  x-user-payload: {"id":"user123","username":"john","email":"john@test.com"}

↓

Step 4: NGINX CAPTURES USER DATA
--------
- auth_request_set $auth_user_payload $upstream_http_x_user_payload
- Now $auth_user_payload = {"id":"user123","username":"john",...}
- Continues with main request

↓

Step 5: NGINX FORWARDS TO POST SERVICE
--------
POST http://post-service:5001/api/v1/posts/create
Headers:
  x-user-payload: {"id":"user123","username":"john","email":"john@test.com"}
  Content-Type: application/json
Body:
  { "content": "My first post!", "images": ["url1.jpg"] }

↓

Step 6: POST SERVICE PROCESSES
--------
// In Post Service code:
const userPayload = req.headers['x-user-payload'];
const user = JSON.parse(userPayload);

// Now we have authenticated user data!
const userId = user.id;        // "user123"
const username = user.username; // "john"

// Create post
const post = await createPost({
  userId: userId,
  username: username,
  content: "My first post!",
  images: ["url1.jpg"]
});

// Save to Posts Database
await db.posts.create(post);

↓

Step 7: RESPONSE FLOWS BACK
--------
Post Service → Nginx → Client

Response:
  HTTP/1.1 201 Created
  {
    "success": true,
    "post": {
      "id": "post789",
      "userId": "user123",
      "username": "john",
      "content": "My first post!",
      "createdAt": "2024-10-17T10:30:00Z"
    }
  }
```

---

## 🗄️ Database Flow

### Users Database (PostgreSQL)
```
Tables:
- User: { id, username, email, password_hash }
- Follow: { id, followerId, followingId, isActive, isDeleted }
- Profile: { userId, bio, avatar, ... }

Used by:
- Auth Service (authentication, registration)
- Users Service (profile management)
- Chat Service (follow relationship checks)
```

### Posts Database (PostgreSQL)
```
Tables:
- Post: { id, userId, content, images, createdAt }
- Comment: { id, postId, userId, content, createdAt }
- Like: { id, postId, userId, createdAt }

Used by:
- Post Service (CRUD operations)
```

### Chat Database (MongoDB)
```
Collections:
- messages: { roomId, senderId, targetId, content, timestamp, status }

Used by:
- Chat Service (persistent message storage)

Note: Redis is used for real-time message cache (last 100 per room)
```

---

## 🎯 Key Principles

### 1. Single Source of Authentication
```
✓ ONLY Auth Service verifies JWT tokens
✓ ONLY Nginx calls Auth Service for verification
✗ Other services NEVER verify tokens themselves
✓ Other services trust x-user-payload header
```

### 2. Microservice Communication
```
External (Client) → Nginx → Service
  ✓ Always through Nginx
  ✓ Includes authentication
  ✓ Includes user payload

Internal (Service → Service) → Direct call
  ✓ Can be direct (if needed)
  ✓ No authentication needed (trusted network)
```

### 3. Follow Relationship Rules
```
Rule: Users can only chat if they follow each other

User A → Follow → User B   ✓
User B → Follow → User A   ✓
Result: Can chat ✓

User A → Follow → User C   ✓
User C → NOT Follow → User A   ✗
Result: Cannot chat ✗
```

---

## 🔄 Service-to-Service Dependencies

```
Auth Service
  ├─ Uses: Users Database
  └─ Called by: Nginx (for verification)

Post Service
  ├─ Uses: Posts Database
  ├─ Depends on: Auth (via Nginx)
  └─ May call: Users Service (for user info)

Chat Service
  ├─ Uses: Chat Database (MongoDB)
  ├─ Uses: Users Database (for follow checks)
  ├─ Uses: Redis (for real-time messages)
  ├─ Depends on: Auth (via Nginx)
  └─ Checks: Follow relationships

Users Service
  ├─ Uses: Users Database
  ├─ Depends on: Auth (via Nginx)
  └─ Provides: User profiles, follow management

Notification Service
  ├─ Uses: Notifications Database
  ├─ Depends on: Auth (via Nginx)
  └─ Receives: Events from other services
```

---

## 🚀 Complete User Journey Example

### Scenario: User A wants to chat with User B

```
1. USER A LOGS IN
   POST /auth/login
   → Gets JWT token
   → Stores token

2. USER A FOLLOWS USER B
   POST /users/follow
   Headers: Authorization: Bearer <token>
   Body: { "targetUserId": "userB" }
   
   Flow:
   - Nginx verifies token
   - Users Service receives x-user-payload
   - Creates Follow record: { followerId: "userA", followingId: "userB" }

3. USER B FOLLOWS USER A BACK
   (Same flow as step 2, but reversed)
   
   Result: Mutual follow established! ✓

4. USER A CHECKS CHATABLE USERS
   GET /chat/chatable-users/userA
   Headers: Authorization: Bearer <token>
   
   Response:
   {
     "chatableUsers": ["userB", ...],
     "count": 1
   }

5. USER A CONNECTS TO SOCKET.IO
   socket = io('http://localhost', {
     auth: { token: 'Bearer <token>' }
   });
   
   - Nginx verifies token
   - Passes x-user-payload to Chat Service
   - Connection established

6. USER A JOINS CHAT ROOM
   socket.emit('join_room', {
     roomId: 'userA_userB',
     targetUserId: 'userB'
   });
   
   Chat Service:
   - Checks follow relationship in Users DB
   - userA follows userB? ✓
   - userB follows userA? ✓
   - Allows join ✓
   - Sends message history from Redis

7. USER A SENDS MESSAGE
   socket.emit('send_message', {
     roomId: 'userA_userB',
     message: 'Hi there!',
     targetUserId: 'userB'
   });
   
   Chat Service:
   - Checks follow relationship again ✓
   - Saves to Redis
   - Publishes to Redis pub/sub
   - Broadcasts to room

8. USER B RECEIVES MESSAGE
   socket.on('message', (data) => {
     console.log(data);
     // { userId: 'userA', username: 'john', message: 'Hi there!' }
   });
```

---

## 📊 Data Flow Diagram

```
                    CLIENT
                      |
                      | HTTP Request
                      | (with JWT token)
                      ↓
                [NGINX GATEWAY]
                      |
        ┌─────────────┼─────────────┐
        |             |             |
  auth_request    routing      headers
        |             |             |
        ↓             |             ↓
   [Auth Service]     |      x-user-payload
        |             |             |
        ↓             ↓             ↓
   [Users DB]  [Target Service] [Service Logic]
                      |             |
                      ↓             ↓
                [Service DB]   [Business Logic]
                      |             |
                      └─────┬───────┘
                            |
                            ↓ Response
                      [NGINX GATEWAY]
                            |
                            ↓
                        CLIENT
```

---

## 🧪 Testing the Complete Flow

### Test 1: Authentication Flow
```bash
# 1. Register
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"pass123"}'

# 2. Login
TOKEN=$(curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}' \
  | jq -r '.token')

# 3. Use token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/users/profile
```

### Test 2: Follow & Chat Flow
```bash
# 1. Login as User A
TOKEN_A=$(curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"userA@test.com","password":"pass123"}' \
  | jq -r '.token')

# 2. Follow User B
curl -X POST http://localhost/users/follow \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"targetUserId":"userB"}'

# 3. Login as User B and follow back
TOKEN_B=$(curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"userB@test.com","password":"pass123"}' \
  | jq -r '.token')

curl -X POST http://localhost/users/follow \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"targetUserId":"userA"}'

# 4. Check chatable users
curl -H "Authorization: Bearer $TOKEN_A" \
  http://localhost/chat/chatable-users/userA

# 5. Send message via REST
curl -X POST http://localhost/chat/userA_userB/message \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!","userId":"userA","username":"john","targetUserId":"userB"}'
```

---

## 🎓 Understanding Key Concepts

### What is JWT Token?
```
JWT = JSON Web Token
Structure: header.payload.signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJ1c2VybmFtZSI6ImpvaG4ifQ.signature

Decoded:
{
  "id": "user123",
  "username": "john",
  "exp": 1697500000  // Expiration timestamp
}

Why it's secure:
- Signed with secret key
- Can't be modified without key
- Expiration time
```

### What is x-user-payload Header?
```
Custom header added by Nginx after auth verification

Format: JSON string
Value: {"id":"user123","username":"john","email":"john@test.com"}

Purpose:
- Pass authenticated user data to services
- Services don't need to verify tokens
- Services trust Nginx
- Fast and efficient
```

### What is auth_request?
```
Nginx directive to verify authentication

How it works:
1. Main request comes in
2. Nginx pauses main request
3. Makes subrequest to auth endpoint
4. If auth returns 200: Continue
5. If auth returns 401/403: Deny
6. Can capture data from auth response

Benefits:
- Centralized authentication
- Services don't handle auth
- DRY (Don't Repeat Yourself)
```

---

## 📝 Summary

### For Developers:
1. **Auth Service**: Handles login/register, issues JWT tokens
2. **Nginx**: Verifies all requests, adds user payload header
3. **Services**: Read user from header, no token verification needed
4. **Chat Service**: Extra check for follow relationships
5. **Databases**: Users (PostgreSQL), Posts (PostgreSQL), Chat (MongoDB)

### Remember:
- ✅ All requests go through Nginx
- ✅ Only Auth Service verifies tokens
- ✅ Services trust x-user-payload header
- ✅ Chat requires mutual follow
- ✅ Socket.IO also authenticated via Nginx

---

**Made with ❤️ for SocialHub Platform**
