# Nginx Gateway - Complete Flow & Configuration Guide

## 📋 Overview
Nginx acts as an API Gateway and reverse proxy for all microservices. It handles authentication, routing, and passes user data to downstream services.

---

## 🏗️ Overall Request Flow

```
Client Request
    ↓
Nginx Gateway (:80)
    ↓
Authentication Check (/auth/verify)
    ↓
Add x-user-payload Header
    ↓
Route to Appropriate Service
    ↓
Service Receives Request with User Data
    ↓
Response back to Client
```

---

## 🔐 Authentication Flow (auth_request)

### Step-by-Step Process:

```
1. Client Request Arrives
   GET /posts/123
   Headers: Authorization: Bearer <jwt_token>
   
2. Nginx Triggers auth_request
   Internal call: GET http://auth-service:5000/api/v1/auth/verify-user
   Headers: Authorization: Bearer <jwt_token>
   
3. Auth Service Validates Token
   - Verifies JWT signature
   - Checks expiration
   - Returns 200 OK with x-user-payload header
   
4. Nginx Captures Response
   auth_request_set $auth_user_payload $upstream_http_x_user_payload
   
5. Nginx Forwards to Service
   POST http://post-service:5001/api/v1/posts/123
   Headers: x-user-payload: {"id":"user123","username":"john"}
   
6. Service Uses User Data
   const user = JSON.parse(req.headers['x-user-payload']);
```

---

## 🛣️ Route Configuration

### 1. Public Routes (No Auth)

#### Auth Service Routes
```nginx
location /auth/ {
    rewrite /auth/(.*) /api/v1/auth/$1 break;
    proxy_pass http://auth_service;
}

# Example:
# /auth/login → http://auth-service:5000/api/v1/auth/login
# /auth/register → http://auth-service:5000/api/v1/auth/register
```

#### Health Check
```nginx
location /chat/health {
    proxy_pass http://chat_service/health;
}

# Example:
# /chat/health → http://chat-service:5004/health
```

---

### 2. Protected Routes (With Auth)

#### Posts Service
```nginx
location /posts/ {
    auth_request /auth/verify;
    auth_request_set $auth_user_payload $upstream_http_x_user_payload;
    proxy_set_header x-user-payload $auth_user_payload;
    
    rewrite /posts/(.*) /api/v1/posts/$1 break;
    proxy_pass http://post_service;
}

# Example:
# /posts/123 → http://post-service:5001/api/v1/posts/123
# With header: x-user-payload: {...}
```

#### Users Service
```nginx
location /users/ {
    auth_request /auth/verify;
    auth_request_set $auth_user_payload $upstream_http_x_user_payload;
    proxy_set_header x-user-payload $auth_user_payload;
    
    rewrite /users/(.*) /api/v1/users/$1 break;
    proxy_pass http://users_service;
}

# Example:
# /users/profile → http://users-service:5003/api/v1/users/profile
```

#### Notification Service
```nginx
location /notify/ {
    auth_request /auth/verify;
    auth_request_set $auth_user_payload $upstream_http_x_user_payload;
    proxy_set_header x-user-payload $auth_user_payload;
    
    rewrite /notify/(.*) /notify/$1 break;
    proxy_pass http://notification_service;
}

# Example:
# /notify/settings → http://notification-service:5002/notify/settings
```

#### Chat Service (REST API)
```nginx
location /chat/ {
    auth_request /auth/verify;
    auth_request_set $auth_user_payload $upstream_http_x_user_payload;
    proxy_set_header x-user-payload $auth_user_payload;
    
    rewrite /chat/(.*) /api/chat/$1 break;
    proxy_pass http://chat_service;
}

# Example:
# /chat/room123/history → http://chat-service:5004/api/chat/room123/history
```

---

### 3. WebSocket Routes (Socket.IO)

#### Socket.IO Connection
```nginx
location /socket.io/ {
    auth_request /auth/verify;
    auth_request_set $auth_user_payload $upstream_http_x_user_payload;
    proxy_set_header x-user-payload $auth_user_payload;
    
    proxy_pass http://chat_service;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Authorization $http_authorization;
    
    # Long timeout for WebSocket
    proxy_read_timeout 86400;
    proxy_send_timeout 86400;
}

# Example:
# /socket.io/?token=... → http://chat-service:5004/socket.io/
```

---

## 🎯 Internal Authentication Endpoint

```nginx
location = /auth/verify {
    internal;  # Only accessible by nginx internally
    proxy_pass http://auth_service/api/v1/auth/verify-user;
    
    # Don't pass request body (optimization)
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    
    # Pass Authorization header
    proxy_set_header Authorization $http_authorization;
}
```

**Key Points:**
- `internal` directive: Not accessible from outside
- Called by `auth_request` directive
- Returns user data in `x-user-payload` header
- Fast response (no body processing)

---

## 📊 Complete Route Table

| Client URL | Auth? | Backend Service | Backend URL |
|------------|-------|----------------|-------------|
| `/auth/login` | ❌ | auth-service:5000 | `/api/v1/auth/login` |
| `/auth/register` | ❌ | auth-service:5000 | `/api/v1/auth/register` |
| `/posts/123` | ✅ | post-service:5001 | `/api/v1/posts/123` |
| `/users/profile` | ✅ | users-service:5003 | `/api/v1/users/profile` |
| `/notify/settings` | ✅ | notification-service:5002 | `/notify/settings` |
| `/chat/room123/history` | ✅ | chat-service:5004 | `/api/chat/room123/history` |
| `/socket.io/` | ✅ | chat-service:5004 | `/socket.io/` |
| `/chat/health` | ❌ | chat-service:5004 | `/health` |

---

## 🔧 Upstream Configuration

```nginx
upstream auth_service {
    server auth-service:5000;
}

upstream post_service {
    server post-service:5001;
}

upstream notification_service {
    server notification-service:5002;
}

upstream users_service {
    server users-service:5003;
}

upstream chat_service {
    server chat-service:5004;
}
```

**Benefits:**
- Easy service discovery
- Load balancing support (add multiple servers)
- Health checks
- Failover support

---

## ⚙️ Important Settings

### Timeouts
```nginx
proxy_connect_timeout 5s;   # Connection timeout
proxy_send_timeout 60s;     # Send timeout
proxy_read_timeout 60s;     # Read timeout (increased for WebSocket)
```

### File Upload
```nginx
client_max_body_size 10M;   # Max request body size
```

### DNS Resolution
```nginx
resolver 127.0.0.11 valid=5s;  # Docker DNS
```

### CORS for Socket.IO
```nginx
add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
```

---

## 🚀 How Services Use User Data

### In Node.js/Express:
```javascript
// Extract user from header
const userPayload = req.headers['x-user-payload'];
const user = JSON.parse(userPayload);

console.log(user.id);       // User ID
console.log(user.username); // Username

// Use in your logic
const userId = user.id;
const posts = await getPostsByUser(userId);
```

### In Socket.IO:
```javascript
// Nginx sets x-user-payload header
io.use((socket, next) => {
  const userPayload = socket.handshake.headers['x-user-payload'];
  const user = JSON.parse(userPayload);
  
  socket.data.userId = user.id;
  socket.data.username = user.username;
  
  next();
});
```

---

## 📝 Testing Nginx Configuration

### Check Syntax
```bash
docker exec nginx nginx -t
```

### Reload Configuration
```bash
docker exec nginx nginx -s reload
```

### View Logs
```bash
docker logs nginx -f
```

### Test Auth Flow
```bash
# 1. Login and get token
TOKEN=$(curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}' \
  | jq -r '.token')

# 2. Make authenticated request
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/posts/123
```

---

## 🐛 Common Issues & Solutions

### Issue 1: 401 Unauthorized
**Reason:** Token missing or invalid  
**Solution:** Check Authorization header format: `Bearer <token>`

### Issue 2: 502 Bad Gateway
**Reason:** Backend service is down  
**Solution:** Check if service container is running

### Issue 3: 504 Gateway Timeout
**Reason:** Backend service taking too long  
**Solution:** Increase proxy_read_timeout or fix slow service

### Issue 4: WebSocket not connecting
**Reason:** Missing Upgrade headers  
**Solution:** Verify proxy_http_version 1.1 and Upgrade headers are set

### Issue 5: CORS errors
**Reason:** Missing CORS headers  
**Solution:** Add CORS headers in location block

---

## 🔄 Request/Response Examples

### Example 1: Login (No Auth)
```
→ Request:
POST /auth/login HTTP/1.1
Host: localhost
Content-Type: application/json

{"email":"test@test.com","password":"pass123"}

→ Nginx Processing:
- Matches location /auth/
- No auth_request (public route)
- Rewrites to /api/v1/auth/login
- Proxies to auth-service:5000

← Response:
HTTP/1.1 200 OK
{"success":true,"token":"eyJhbGc...","user":{...}}
```

### Example 2: Get Posts (With Auth)
```
→ Request:
GET /posts/123 HTTP/1.1
Host: localhost
Authorization: Bearer eyJhbGc...

→ Nginx Processing:
- Matches location /posts/
- Triggers auth_request /auth/verify
  → Internal call to auth-service:5000/api/v1/auth/verify-user
  ← Gets x-user-payload: {"id":"user123","username":"john"}
- Captures user payload
- Rewrites to /api/v1/posts/123
- Proxies to post-service:5001
- Adds header: x-user-payload

→ Backend Receives:
GET /api/v1/posts/123 HTTP/1.1
Host: post-service:5001
x-user-payload: {"id":"user123","username":"john"}

← Response:
HTTP/1.1 200 OK
{"success":true,"post":{...}}
```

### Example 3: WebSocket Connection
```
→ Request:
GET /socket.io/?transport=websocket HTTP/1.1
Host: localhost
Authorization: Bearer eyJhbGc...
Upgrade: websocket
Connection: Upgrade

→ Nginx Processing:
- Matches location /socket.io/
- Triggers auth_request /auth/verify
- Gets user payload
- Upgrades to WebSocket
- Proxies to chat-service:5004
- Maintains connection (86400s timeout)

→ Backend Receives:
GET /socket.io/?transport=websocket HTTP/1.1
Host: chat-service:5004
x-user-payload: {"id":"user123","username":"john"}
Upgrade: websocket
Connection: Upgrade

← Response:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
```

---

## 📊 Flow Diagrams

### Auth Flow:
```
Client → Nginx → Auth Service → Nginx → Backend Service
  |        |                       |
  |        |--auth_request-------->|
  |        |<---user payload-------|
  |        |                       |
  |        |----with payload------>|
```

### WebSocket Flow:
```
Client → Nginx → Auth Service
  |        |         |
  |        |--verify-|
  |        |<--OK----|
  |        |
  ↓        ↓
Persistent WebSocket Connection
  |        |
Client ←→ Nginx ←→ Chat Service
```

---

## 🎓 Key Concepts

### 1. auth_request Directive
- Makes subrequest before processing main request
- If subrequest returns 2xx, main request proceeds
- If subrequest returns 401/403, client gets denied

### 2. auth_request_set
- Captures variables from subrequest response
- Used to get user data from auth service
- Makes data available to main request

### 3. proxy_set_header
- Sets headers for proxied request
- Used to pass user data to backend services
- Can add/modify/remove headers

### 4. internal Directive
- Location only accessible internally by nginx
- Not accessible from outside network
- Used for auth verification endpoint

---

## 🔐 Security Best Practices

1. ✅ Use `internal` for auth verification endpoint
2. ✅ Always validate tokens before proxying
3. ✅ Pass minimal user data to services (id, username only)
4. ✅ Set appropriate timeouts
5. ✅ Configure CORS properly for production
6. ✅ Use HTTPS in production
7. ✅ Rate limiting (can be added)
8. ✅ IP whitelisting for admin routes (optional)

---

## 📁 Files Structure

```
gateway/
├── nginx.conf              # Main configuration file
├── NGINX_README.md        # This documentation
└── Dockerfile             # Nginx container image
```

---

## 🚀 Quick Reference

### Start Nginx
```bash
docker-compose up -d nginx
```

### Check Logs
```bash
docker logs nginx -f
```

### Reload Config
```bash
docker exec nginx nginx -s reload
```

### Test Config
```bash
docker exec nginx nginx -t
```

### Stop Nginx
```bash
docker-compose stop nginx
```

---

**Made with ❤️ for SocialHub Platform**
