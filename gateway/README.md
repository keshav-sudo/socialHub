# API Gateway (Nginx)

## Overview
The API Gateway serves as the single entry point for all client requests. It handles routing, authentication verification, and load balancing across microservices.

## Architecture

```
Client → Gateway (Nginx) → Microservices
                ↓
         Auth Verification
```

## Technology Stack
- **Nginx**: Reverse proxy and load balancer
- **Docker**: Containerization

## Port
- **80**: HTTP Gateway

## Routing Configuration

### Public Routes (No Auth Required)

#### Auth Service Routes
- **Base Path**: `/auth/*`
- **Target**: `auth-service:5000/api/v1/auth/*`
- **Examples**:
  - `POST /auth/login` → Login user
  - `POST /auth/signup` → Register new user
  - `POST /auth/request-password-reset` → Request password reset
  - `POST /auth/verify-reset-otp/:email` → Verify reset OTP
  - `POST /auth/reset-password` → Reset password
  - `POST /auth/check/:username` → Check username availability

### Protected Routes (Auth Required)

All protected routes require `Authorization: Bearer <token>` header.

#### Users Service Routes
- **Base Path**: `/users/*`
- **Target**: `users-service:5003/api/v1/users/*`
- **Auth**: Required via `/auth/verify`
- **Examples**:
  - `POST /users/follow/:id` → Follow a user
  - `POST /users/unfollow/:id` → Unfollow a user
  - `GET /users/following/list` → Get following list
  - `GET /users/followers/list` → Get followers list
  - `GET /users/counts` → Get follow counts

#### Posts Service Routes
- **Base Path**: `/posts/*`
- **Target**: `post-service:5001/api/v1/posts/*`
- **Auth**: Required via `/auth/verify`
- **Examples**:
  - `POST /posts/` → Create new post (multipart/form-data)
  - `GET /posts/getall` → Get all posts
  - `GET /posts/:id` → Get specific post
  - `PATCH /posts/:id` → Update post
  - `DELETE /posts/:id` → Delete post
  - `POST /posts/comment/:id` → Add comment
  - `GET /posts/comment/:id` → Get comments
  - `PATCH /posts/comment/:id` → Update comment
  - `DELETE /posts/comment/:id` → Delete comment
  - `POST /posts/like/:id` → Like post
  - `PATCH /posts/like/:id` → Dislike post

#### Notification Service Routes
- **Base Path**: `/notify/*`
- **Target**: `notification-service:5002/notify/*`
- **Auth**: Required via `/auth/verify`
- **Examples**:
  - `GET /notify/notifications` → Get user notifications

#### Chat Service Routes
- **Base Path**: `/chat/*`
- **Target**: `chat-service:5004/api/chat/*`
- **Auth**: Required via `/auth/verify`
- **Examples**:
  - `GET /chat/:roomId/history` → Get chat history (REST endpoint)
  - WebSocket connections for real-time chat

## Authentication Flow

1. Client sends request with `Authorization: Bearer <token>` header
2. Gateway intercepts and sends auth verification request to `/auth/verify`
3. Auth service validates token and returns user payload
4. Gateway forwards request to target service with `x-user-payload` header
5. Target service processes request with authenticated user context

## Configuration Details

### Upstream Services
```nginx
auth-service:5000
post-service:5001
notification-service:5002
users-service:5003
chat-service:5004
```

### Timeouts
- **Connect Timeout**: 5s
- **Send Timeout**: 5s
- **Read Timeout**: 10s

### Request Limits
- **Max Body Size**: 10MB (for file uploads)

## Testing the Gateway

### Test Public Endpoint
```bash
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Test Protected Endpoint
```bash
# First login to get token
TOKEN=$(curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.token')

# Use token to access protected route
curl -X GET http://localhost/users/counts \
  -H "Authorization: Bearer $TOKEN"
```

## Error Handling

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Route not configured
- **502 Bad Gateway**: Service unavailable
- **504 Gateway Timeout**: Request timeout

## Monitoring

### Health Check
```bash
curl http://localhost/
# Returns: "API endpoint not found." (404) - Gateway is running
```

### Service-Specific Health Checks
```bash
# Auth service
curl http://auth-service:5000/health

# Users service
curl http://users-service:5003/health

# Posts service
curl http://post-service:5001/health

# Chat service
curl http://chat-service:5004/health

# Notification service
curl http://notification-service:5002/health
```

## Docker Configuration

```yaml
# docker-compose.yml
gateway:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./gateway/nginx.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - auth-service
    - users-service
    - post-service
    - chat-service
    - notification-service
```

## Future Enhancements

- Rate limiting per user/IP
- Request/response logging
- SSL/TLS termination
- Caching layer
- API versioning support
- WebSocket proxy improvements
