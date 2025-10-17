# API Testing Guide

This document provides all API endpoints for testing through nginx gateway running on **port 8080**.

## Base URL
```
http://localhost:8080
```

---

## 🔐 Auth Service APIs
**Base Path:** `/auth/*` → Routes to `auth-service:5000/api/v1/auth/*`

### 1. User Signup
```bash
POST http://localhost:8080/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. User Login
```bash
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Check Username Availability
```bash
POST http://localhost:8080/auth/check/{username}
```

### 4. Request Password Reset
```bash
POST http://localhost:8080/auth/request-password-reset
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 5. Verify Reset OTP
```bash
POST http://localhost:8080/auth/verify-reset-otp/{email}
Content-Type: application/json

{
  "otp": "123456"
}
```

### 6. Reset Password
```bash
POST http://localhost:8080/auth/reset-password
Content-Type: application/json

{
  "email": "test@example.com",
  "newPassword": "newpassword123",
  "otp": "123456"
}
```

### 7. Verify User (Internal - used by nginx)
```bash
GET http://localhost:8080/auth/verify-user
Authorization: Bearer {token}
```

---

## 📝 Posts Service APIs (Protected)
**Base Path:** `/posts/*` → Routes to `post-service:5001/api/v1/posts/*`

**Note:** All posts endpoints require authentication. Include `Authorization: Bearer {token}` header.

### 1. Create Post
```bash
POST http://localhost:8080/posts/
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Post",
  "content": "Post content here",
  "tags": ["tech", "nodejs"]
}
```

### 2. Get All Posts
```bash
GET http://localhost:8080/posts/
Authorization: Bearer {token}
```

### 3. Get Post by ID
```bash
GET http://localhost:8080/posts/{postId}
Authorization: Bearer {token}
```

### 4. Update Post
```bash
PUT http://localhost:8080/posts/{postId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### 5. Delete Post
```bash
DELETE http://localhost:8080/posts/{postId}
Authorization: Bearer {token}
```

---

## 👥 Users Service APIs (Protected)
**Base Path:** `/users/*` → Routes to `users-service:5003/api/v1/users/*`

**Note:** All users endpoints require authentication.

### 1. Get User Profile
```bash
GET http://localhost:8080/users/profile
Authorization: Bearer {token}
```

### 2. Update User Profile
```bash
PUT http://localhost:8080/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "bio": "Developer"
}
```

### 3. Get User by ID
```bash
GET http://localhost:8080/users/{userId}
Authorization: Bearer {token}
```

---

## 💬 Chat Service APIs (Protected)
**Base Path:** `/chat/*` → Routes to `chat-service:5004/api/chat/*`

**Note:** All chat endpoints require authentication.

### 1. Health Check (Public)
```bash
GET http://localhost:8080/chat/health
```

### 2. Get Conversations
```bash
GET http://localhost:8080/chat/conversations
Authorization: Bearer {token}
```

### 3. Send Message
```bash
POST http://localhost:8080/chat/message
Authorization: Bearer {token}
Content-Type: application/json

{
  "conversationId": "conv123",
  "message": "Hello there!"
}
```

### 4. WebSocket Connection (Socket.IO)
```javascript
// Option 1: Root path
const socket = io("http://localhost:8080", {
  auth: {
    token: "your-jwt-token"
  }
});

// Option 2: With /chat prefix
const socket = io("http://localhost:8080/chat", {
  auth: {
    token: "your-jwt-token"
  }
});
```

---

## 📰 Feed Service APIs (Protected)
**Base Path:** `/feed/*` → Routes to `feed-service:5005/api/feed/*`

**Note:** All feed endpoints require authentication.

### 1. Get Feed
```bash
GET http://localhost:8080/feed/
Authorization: Bearer {token}
```

### 2. Get Personalized Feed
```bash
GET http://localhost:8080/feed/personalized
Authorization: Bearer {token}
```

---

## 🔔 Notification Service APIs (Protected)
**Base Path:** `/notify/*` → Routes to `notification-service:5002/notify/*`

**Note:** All notification endpoints require authentication.

### 1. Get Notifications
```bash
GET http://localhost:8080/notify/notifications
Authorization: Bearer {token}
```

### 2. Get Notification Settings
```bash
GET http://localhost:8080/notify/settings
Authorization: Bearer {token}
```

### 3. Update Settings
```bash
PUT http://localhost:8080/notify/settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "emailNotifications": true,
  "pushNotifications": false
}
```

---

## 🔧 Nginx Configuration

### Port Mapping
- **Nginx Gateway:** `8080:80`
- **Auth Service:** `5000`
- **Post Service:** `5001`
- **Notification Service:** `5002`
- **Users Service:** `5003`
- **Chat Service:** `5004`
- **Feed Service:** `5005`

### Path Rewriting Rules
| Nginx Path | Service Path |
|------------|--------------|
| `/auth/*` | `/api/v1/auth/*` |
| `/posts/*` | `/api/v1/posts/*` |
| `/users/*` | `/api/v1/users/*` |
| `/chat/*` | `/api/chat/*` |
| `/feed/*` | `/api/feed/*` |
| `/notify/*` | `/notify/*` |

### Authentication Flow
1. Public endpoints (auth service) don't require authentication
2. Protected endpoints trigger internal `/auth/verify` request
3. Auth service validates token and returns user payload in `x-user-payload` header
4. Nginx forwards the user payload to downstream services

---

## 🧪 Testing with cURL

### Example: Complete Flow

1. **Signup**
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"pass123"}'
```

2. **Login**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

3. **Create Post (with token)**
```bash
curl -X POST http://localhost:8080/posts/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"This is a test"}'
```

4. **Get Feed**
```bash
curl -X GET http://localhost:8080/feed/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Testing with Postman

1. Create a new collection
2. Set collection variable: `baseUrl = http://localhost:8080`
3. Set collection variable: `token = <empty>` (will be filled after login)
4. For login/signup requests:
   - Save the token from response to `token` variable
5. For protected endpoints:
   - Add header: `Authorization: Bearer {{token}}`

---

## 🐛 Common Issues

### 404 Not Found
- Check if the service path matches nginx routing rules
- Verify docker containers are running: `docker ps`

### 401 Unauthorized
- Token might be expired or invalid
- Get a new token by logging in again
- Ensure `Authorization: Bearer {token}` header is set

### 504 Gateway Timeout
- Service might be down
- Check service logs: `docker logs <container-name>`

### CORS Issues (WebSocket)
- CORS is configured for Socket.IO on `/socket.io/` path
- Use proper authentication token in socket connection

---

## 🚀 Quick Start

1. Start all services:
```bash
docker-compose up -d
```

2. Check nginx is running:
```bash
curl http://localhost:8080/
# Should return: "API endpoint not found."
```

3. Test auth service:
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user1@test.com","password":"test123"}'
```

4. Save the token from login response and use it for protected endpoints!

---

## 📚 Additional Notes

- All services use `/api/v1/` or `/api/` prefix internally
- Nginx strips the prefix and routes based on path
- Maximum request body size: **10MB**
- WebSocket timeout: **24 hours** (86400 seconds)
- Auth request timeout: **60 seconds**
