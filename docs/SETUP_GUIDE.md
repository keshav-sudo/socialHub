# 🎯 SocialHub - Complete Setup Guide

This guide walks you through setting up SocialHub from scratch, ensuring everything works properly.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Starting Services](#starting-services)
7. [Verification](#verification)
8. [Development Setup](#development-setup)
9. [Production Setup](#production-setup)
10. [Common Issues](#common-issues)

---

## Prerequisites

### Required Software

- **Docker Desktop** (v20.10+) or **Docker Engine + Docker Compose**
  - Download: https://www.docker.com/products/docker-desktop/
  - Verify: `docker --version && docker compose version`

- **Node.js** (v18+) - For local development
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **Git** - For cloning repository
  - Verify: `git --version`

- **curl** - For API testing
  - Usually pre-installed on Linux/Mac
  - Windows: Use Git Bash or WSL

### Optional Tools

- **wscat** - For WebSocket testing
  - Install: `npm install -g wscat`

- **jq** - For JSON parsing
  - Linux: `sudo apt install jq`
  - Mac: `brew install jq`

---

## System Requirements

### Minimum Requirements

- **CPU:** 4 cores
- **RAM:** 8 GB
- **Disk:** 20 GB free space
- **OS:** Linux, macOS, or Windows 10+ with WSL2

### Recommended Requirements

- **CPU:** 8 cores
- **RAM:** 16 GB
- **Disk:** 50 GB SSD
- **OS:** Linux or macOS (for best Docker performance)

---

## Installation Steps

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/socialHub.git
cd socialHub

# Verify directory structure
ls -la
# You should see: services/, gateway/, infra/, README.md, etc.
```

### Step 2: Install Dependencies

```bash
# Install dependencies for all services

# Auth Service
cd services/auth-service
npm install
cd ../..

# Users Service
cd services/users-service
npm install
cd ../..

# Post Service
cd services/post-service
npm install
cd ../..

# Notification Service
cd services/notification-service
npm install
cd ../..

# Chat Service
cd services/chat-service
npm install
cd ../..

# Feed Service
cd services/feed-service
npm install
cd ../..
```

### Step 3: Setup External Services

#### Cloudinary (Image Hosting)

1. Sign up at https://cloudinary.com/ (free tier)
2. Get your credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

#### Google Gemini (AI Features - Optional)

1. Get API key from https://makersuite.google.com/app/apikey
2. Save for Post Service configuration

---

## Configuration

### Environment Variables

Create `.env` files for each service:

#### 1. Auth Service

```bash
cat > services/auth-service/.env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long-change-this"
JWT_EXPIRES_IN="24h"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379

# Email Configuration (for OTP)
EMAIL_SERVICE="gmail"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"
FROM_EMAIL="noreply@socialhub.com"

# AWS SES Configuration (alternative to Gmail)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
SES_FROM_EMAIL="noreply@socialhub.com"
EOF
```

#### 2. Users Service

```bash
cat > services/users-service/.env << 'EOF'
# Server Configuration
PORT=5003
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/users_db?schema=public"

# Kafka Configuration
KAFKA_BROKERS="localhost:9092"
KAFKA_CLIENT_ID="users-service"
KAFKA_GROUP_ID="users-group"

# Topics
USER_TOPIC="USER_TOPIC"
EOF
```

#### 3. Post Service

```bash
cat > services/post-service/.env << 'EOF'
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/posts_db?schema=public"

# Kafka Configuration
KAFKA_BROKERS="localhost:9092"
KAFKA_CLIENT_ID="post-service"

# Topics
POST_TOPIC="POST_TOPIC"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Gemini AI Configuration (Optional)
GEMINI_API_KEY="your-gemini-api-key"
EOF
```

#### 4. Notification Service

```bash
cat > services/notification-service/.env << 'EOF'
# Server Configuration
PORT=5002
NODE_ENV=development

# MongoDB
MONGODB_URL="mongodb://localhost:27017/notifications?authSource=admin"

# Kafka Configuration
KAFKA_BROKERS="localhost:9092"
KAFKA_CLIENT_ID="notification-service"
KAFKA_GROUP_ID="notification-group"

# Topics to consume
POST_TOPIC="POST_TOPIC"
USER_TOPIC="USER_TOPIC"
EOF
```

#### 5. Chat Service

```bash
cat > services/chat-service/.env << 'EOF'
# Server Configuration
PORT=5004
NODE_ENV=development

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379

# WebSocket Configuration
WS_PORT=5004
CORS_ORIGIN="http://localhost:5173"
EOF
```

#### 6. Feed Service

```bash
cat > services/feed-service/.env << 'EOF'
# Server Configuration
PORT=5005
NODE_ENV=development

# Database (shared with Post Service)
DATABASE_URL="postgresql://postgres:password@localhost:5432/posts_db?schema=public"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379

# Kafka Configuration
KAFKA_BROKERS="localhost:9092"
KAFKA_CLIENT_ID="feed-service"
KAFKA_GROUP_ID="feed-group"

# Topics
POST_TOPIC="POST_TOPIC"
USER_TOPIC="USER_TOPIC"

# Cache Configuration
FEED_CACHE_TTL=300  # 5 minutes
EOF
```

### Docker Configuration

The `docker-compose.yml` is already configured, but verify it matches your setup:

```bash
cat docker-compose.yml
```

Key points:
- Services use the same network: `socialhub-network`
- Services depend on infrastructure (Redis, Kafka)
- Environment files are loaded from `services/SERVICE_NAME/.env`

---

## Database Setup

### Option 1: Using Docker (Recommended for Development)

The databases will be created automatically when you start services.

### Option 2: Using External Databases

If using external PostgreSQL/MongoDB:

1. **Create Databases:**
```sql
-- PostgreSQL
CREATE DATABASE auth_db;
CREATE DATABASE users_db;
CREATE DATABASE posts_db;
```

2. **Update .env files** with your database URLs

3. **Run Migrations:**
```bash
# Auth Service
cd services/auth-service
npx prisma migrate deploy
npx prisma generate

# Users Service
cd ../users-service
npx prisma migrate deploy
npx prisma generate

# Post Service
cd ../post-service
npx prisma migrate deploy
npx prisma generate

# Notification Service
cd ../notification-service
npx prisma generate
```

---

## Starting Services

### Quick Start (All Services)

```bash
# 1. Start infrastructure
docker compose up -d redis kafka

# 2. Wait for Kafka to be ready (30 seconds)
sleep 30

# 3. Verify infrastructure
docker compose ps
docker compose exec redis redis-cli ping

# 4. Build services
cd services/auth-service && npm run build && cd ../..
cd services/users-service && npm run build && cd ../..
cd services/post-service && npm run build && cd ../..
cd services/notification-service && npm run build && cd ../..
cd services/chat-service && npm run build && cd ../..
cd services/feed-service && npm run build && cd ../..

# 5. Start all services
docker compose up -d

# 6. Check logs
docker compose logs -f
```

### Start Individual Services (Development)

```bash
# Terminal 1 - Infrastructure
docker compose up redis kafka

# Terminal 2 - Auth Service
cd services/auth-service
npm run dev

# Terminal 3 - Users Service
cd services/users-service
npm run dev

# Terminal 4 - Post Service
cd services/post-service
npm run dev

# Terminal 5 - Notification Service
cd services/notification-service
npm run dev

# Terminal 6 - Chat Service
cd services/chat-service
npm run dev

# Terminal 7 - Feed Service
cd services/feed-service
npm run dev

# Terminal 8 - Gateway (if using Node gateway)
cd services/gateway
npm run dev
```

---

## Verification

### Automated Verification

```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

This will test:
- Docker containers
- Database connectivity
- Service endpoints
- Authentication flow
- JWT validation

### Manual Verification

```bash
# 1. Check all containers are running
docker compose ps

# Expected: All services show "Up"

# 2. Test infrastructure
docker compose exec redis redis-cli ping  # Should return: PONG
docker compose logs kafka | grep "started"  # Should show Kafka started

# 3. Test service endpoints
curl http://localhost:5000/  # Auth Service
curl http://localhost:5003/  # Users Service
curl http://localhost:5001/  # Post Service
curl http://localhost:5002/  # Notification Service
curl http://localhost:5004/health  # Chat Service
curl http://localhost:5005/  # Feed Service
curl http://localhost:8080/  # Gateway (should return 404, that's ok)

# 4. Test authentication
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "Password123!"
  }'

# Should return: {"message": "...", "token": "..."}
```

---

## Development Setup

### Hot Reload Development

For faster development with hot reload:

```bash
# Add dev script to package.json (if not exists)
# "dev": "tsx watch src/index.ts"

# Install tsx globally
npm install -g tsx

# Run service in dev mode
cd services/SERVICE_NAME
npm run dev
```

### Database Tools

```bash
# Prisma Studio - Visual database browser
cd services/auth-service
npx prisma studio
# Opens at http://localhost:5555

# View database schema
npx prisma db push

# Create migration
npx prisma migrate dev --name add_new_field
```

### Debugging

Add to VSCode `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Auth Service",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/services/auth-service",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

## Production Setup

### Environment Variables

Update all `.env` files:

```bash
# Change NODE_ENV
NODE_ENV=production

# Use secure JWT_SECRET (32+ characters)
JWT_SECRET="$(openssl rand -base64 32)"

# Use production database URLs
DATABASE_URL="postgresql://user:pass@prod-db.example.com:5432/db"

# Use production Redis/Kafka
REDIS_URL="redis://prod-redis.example.com:6379"
KAFKA_BROKERS="prod-kafka1:9092,prod-kafka2:9092,prod-kafka3:9092"
```

### Build Production Images

```bash
# Build all services
docker compose -f docker-compose.prod.yml build

# Push to registry
docker tag socialhub/auth-service:latest registry.example.com/auth-service:v1.0
docker push registry.example.com/auth-service:v1.0

# Repeat for all services
```

### Kubernetes Deployment

```bash
# Apply manifests
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/configmaps/
kubectl apply -f infra/k8s/secrets/
kubectl apply -f infra/k8s/deployments/
kubectl apply -f infra/k8s/services/
kubectl apply -f infra/k8s/ingress/

# Check status
kubectl get pods -n socialhub
kubectl get svc -n socialhub
```

---

## Common Issues

See [README.md - Troubleshooting](./README.md#troubleshooting) section for detailed solutions.

### Quick Fixes

```bash
# Restart all services
docker compose restart

# Rebuild all services
docker compose up -d --build

# Reset everything (⚠️ deletes data)
docker compose down -v
docker compose up -d

# Check logs
docker compose logs SERVICE_NAME

# Check specific errors
docker compose logs SERVICE_NAME | grep -i error
```

---

## Next Steps

After successful setup:

1. ✅ Read **[CODE_FLOW.md](./CODE_FLOW.md)** to understand how everything works
2. ✅ Read **[API_TESTING.md](./API_TESTING.md)** to test all endpoints
3. ✅ Check individual service READMEs for detailed documentation
4. ✅ Set up monitoring (Prometheus + Grafana)
5. ✅ Configure logging (ELK stack)
6. ✅ Add CI/CD pipeline

---

## Support

If you encounter issues:

1. Run `./verify-setup.sh` for automated diagnostics
2. Check service logs: `docker compose logs SERVICE_NAME`
3. Review troubleshooting guide in README.md
4. Check individual service READMEs
5. Create an issue on GitHub with logs and error details

---
