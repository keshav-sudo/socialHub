# Auth Service

## Overview
Handles user authentication, registration, JWT token management, and password reset functionality. Provides gRPC endpoints for internal token validation.

## Architecture

```
Client → Gateway → Auth Service → PostgreSQL
                                → Redis (session/cache)
                                
Internal Services → gRPC → Auth Service (token validation)
```

## Technology Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (user credentials, tokens)
- **Cache**: Redis (session storage, blacklist, rate limiting)
- **Communication**: REST API (external), gRPC (internal)
- **Auth**: JWT (JSON Web Tokens)

## Port
- **5000**: HTTP REST API
- **50051**: gRPC Server (internal)

## Database Schema (Prisma)

### User Model
```prisma
model User {
  id             String   @id @default(cuid())
  name           String
  username       String   @unique
  email          String   @unique
  password       String
  googleId       String?
  role           Role     @default(USER)
  avatar         String? 
  isVerified     Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

**Note**: Password reset OTPs are stored in Redis for temporary storage with TTL expiry.

## API Endpoints

### Public Endpoints

#### 1. User Registration
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

#### 2. User Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

#### 3. Request Password Reset
```http
POST /api/v1/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "OTP sent to email"
}
```

#### 4. Verify Reset OTP
```http
POST /api/v1/auth/verify-reset-otp/:email
Content-Type: application/json

{
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "OTP verified",
  "resetToken": "temporary_reset_token"
}
```

#### 5. Reset Password
```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "resetToken": "temporary_reset_token",
  "newPassword": "NewSecurePass123!"
}

Response:
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### 6. Check Username Availability
```http
POST /api/v1/auth/check/:username

Response:
{
  "available": true
}
```

### Internal Endpoints (used by Gateway)

#### 7. Verify User Token
```http
GET /api/v1/auth/verify-user
Authorization: Bearer <token>

Response:
Headers:
  x-user-payload: {"userId":"uuid","email":"user@example.com","username":"john_doe"}

Body:
{
  "valid": true,
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

## gRPC Service (Internal)

**Note**: gRPC is currently NOT implemented in this service. Token validation is done via the REST endpoint `/api/v1/auth/verify-user` which is called by Nginx gateway internally.

### Future gRPC Implementation
```protobuf
service AuthService {
  rpc ValidateToken (TokenRequest) returns (TokenResponse);
  rpc GetUserById (UserRequest) returns (UserResponse);
}

message TokenRequest {
  string token = 1;
}

message TokenResponse {
  bool valid = 1;
  string userId = 2;
  string email = 3;
  string username = 4;
}
```

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@postgres:5432/auth_db

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# gRPC
GRPC_PORT=50051
```

## Testing APIs

### Using cURL

```bash
# 1. Register a new user
curl -X POST http://localhost/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123!"
  }'

# 2. Login
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# 3. Check username availability
curl -X POST http://localhost/auth/check/john_doe

# 4. Request password reset
curl -X POST http://localhost/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# 5. Verify JWT token (internal - through gateway)
TOKEN="your-jwt-token"
curl -X GET http://auth-service:5000/api/v1/auth/verify-user \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Import the collection from `docs/postman/auth-service.json`
2. Set environment variables for `base_url` and `token`
3. Run requests in order: Signup → Login → Protected Routes

## Redis Usage

### Session Storage
```
Key: session:{userId}
Value: {token, refreshToken, lastActivity}
TTL: 24 hours
```

### Token Blacklist
```
Key: blacklist:{token}
Value: 1
TTL: Token expiry time
```

### Rate Limiting
```
Key: ratelimit:{ip}:{endpoint}
Value: request_count
TTL: 1 minute
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: HS256 algorithm with expiration
- **Rate Limiting**: 5 requests per minute for auth endpoints
- **Input Validation**: Email format, password strength
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization

## Error Codes

- **400**: Bad Request (invalid input)
- **401**: Unauthorized (invalid credentials/token)
- **403**: Forbidden (token blacklisted)
- **404**: Not Found (user not found)
- **409**: Conflict (email/username already exists)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error

## Monitoring & Health Check

```bash
# Health check endpoint
curl http://localhost:5000/health

Response:
{
  "status": "ok",
  "service": "auth-service",
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
```

## Docker

```bash
# Build image
docker build -t auth-service .

# Run container
docker run -p 5000:5000 --env-file .env auth-service
```

## Dependencies

```json
{
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "pg": "^8.11.3",
  "ioredis": "^5.3.2",
  "joi": "^17.11.0",
  "nodemailer": "^6.9.7",
  "@grpc/grpc-js": "^1.9.13"
}
```

## Future Enhancements

- OAuth2 integration (Google, GitHub)
- Two-Factor Authentication (2FA)
- Biometric authentication support
- Session management dashboard
- Audit logging
- Account lockout after failed attempts
