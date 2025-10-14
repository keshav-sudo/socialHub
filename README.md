# 📖 Social Media Microservices Documentation

This document explains the **architecture, services, communication flow, databases, and infra** for the social-media-backend project.
---

## 🏗 High-Level Architecture

```
Client (Web/Mobile)
        │
        ▼
 ┌─────────────┐
 │  API Gateway │  (Reverse Proxy, JWT check, rate limiting)
 └─────┬───────┘
       │
 ┌─────┼─────────────────────────────────────────────┐
 │     │              │                │              │
 ▼     ▼              ▼                ▼              ▼
Auth  User          Post             Feed          Notification
Srv   Srv           Srv              Srv           Srv
PG+R  PG+R          Mongo+S3+R       PG+R+Kafka    PG+R+MQ
```
<img width="1394" height="827" alt="image" src="https://github.com/user-attachments/assets/baa351c9-b474-477b-9af0-d6e22b26d84a" />
ExcaliDraw Link : https://excalidraw.com/#json=JBxqwMuW_JseSTBSfuiKw,BN5Jm57Iu_ASLuLZAueziA



| Service          | Communicates With                         | Communication Method / Protocol           |
| ---------------- | ----------------------------------------- | ----------------------------------------- |
| **Auth**         | All services (User, Post, Feed, Chat, VC) | gRPC (JWT validation, auth)               |
| **User**         | Auth                                      | gRPC (JWT validation)                     |
|                  | Feed                                      | Direct DB query or gRPC / API calls       |
|                  | Notification                              | gRPC / API calls                          |
|                  | Chat                                      | gRPC / API calls                          |
|                  | VC                                        | gRPC / API calls                          |
| **Post**         | Feed                                      | Kafka (publishes `new_post` events)       |
|                  | Notification                              | RabbitMQ (publishes `new_post` events)    |
|                  | User                                      | gRPC / API calls                          |
|                  | Auth                                      | gRPC (JWT validation)                     |
| **Feed**         | Post                                      | Kafka (consumes `new_post` events)        |
|                  | User                                      | gRPC / DB queries                         |
|                  | Redis                                     | Caching feeds                             |
|                  | Auth                                      | gRPC (JWT validation)                     |
| **Notification** | Post                                      | RabbitMQ (consumes `new_post` events)     |
|                  | Chat                                      | RabbitMQ (consumes `new_message` events)  |
|                  | User                                      | gRPC / DB queries                         |
|                  | Auth                                      | gRPC (JWT validation)                     |
| **Chat**         | Auth                                      | gRPC (JWT validation)                     |
|                  | Notification                              | RabbitMQ (publishes `new_message` events) |
|                  | User                                      | gRPC / DB queries                         |
|                  | Redis                                     | Pub/Sub for realtime messaging            |
| **VC**           | Auth                                      | gRPC (JWT validation)                     |
|                  | User                                      | gRPC / DB queries                         |
|                  | Redis                                     | Pub/Sub for realtime signaling            |


* **Auth Service (Postgres + Redis)** → Login, register, JWT validation (exposed via gRPC for internal use).
* **User Service (Postgres + Redis)** → User profiles, followers, caching.
* **Post Service (MongoDB + S3 + Redis)** → Posts, media, publishes `new_post` events.
* **Feed Service (Postgres + Redis + Kafka)** → Consumes post events, builds feeds.
* **Notification Service (Postgres + RabbitMQ)** → Consumes events (new\_post, new\_message), stores + pushes notifications.
* **Chat Service (MongoDB + Redis)** → Messages, presence, Redis pub/sub for realtime, uses gRPC Auth.
* **VC Service (MongoDB + Redis)** → Video call sessions, signaling, presence.

---

## 🔗 Communication Model

### 1. **Frontend → Backend**

* Always goes through **Nginx Gateway** (Port 80).
* Uses **REST (JSON over HTTP)**.
* Gateway routes:
  - `/auth/*` → auth-service:5000
  - `/users/*` → users-service:5003 (protected)
  - `/posts/*` → post-service:5001 (protected)
  - `/notify/*` → notification-service:5002 (protected)
  - `/chat/*` → chat-service:5004 (WebSocket + REST, protected)

### 2. **Service → Service (Internal)**

* **Token validation**: Nginx calls Auth service `/api/v1/auth/verify-user` (REST, not gRPC yet)
* **Async events**: Kafka for post/user events
* **Real-time**: Redis pub/sub for chat messages

### 3. **Event-driven (Pub/Sub)**

* **Post → Notification Service** (Kafka - POST_TOPIC)
  - Events: `post.created`, `comment.created`, `like.created`
* **Users → Notification Service** (Kafka - USER_TOPIC)
  - Events: `follow.created`, `unfollow.created`
* **Chat → Multiple Instances** (Redis Pub/Sub)
  - Channel: `chat:room:{roomId}` for real-time message broadcasting

### 4. **Current Implementation Status**

✅ **Implemented**:
- REST APIs for all services
- Kafka event publishing (Post, Users services)
- Kafka event consuming (Notification service)
- Redis pub/sub for Chat service
- Nginx gateway with auth verification

⏳ **Not Implemented Yet**:
- gRPC for inter-service communication
- RabbitMQ (replaced by Kafka)
- Feed Service
- VC Service

---

## ⚡ Example Request Flows

### 🔑 User Login
1. Client → Gateway `/auth/login` → Auth Service
2. Auth Service → PostgreSQL (check user) → generate JWT
3. JWT stored in Redis (optional session)
4. Response → Client with JWT token

### 👥 Follow a User
1. Client → Gateway `/users/follow/:id` → Users Service
2. Users Service validates JWT (via Nginx → Auth verify)
3. Users Service → PostgreSQL (upsert users, create follow record)
4. Users Service → Kafka publish `follow.created` to USER_TOPIC
5. Notification Service consumes event → MongoDB (create notification)
6. Response → Client (success)

### 💬 Sending a Chat Message
1. Client connects via WebSocket to Chat Service
2. Client emits `authenticate` event with user credentials
3. Client emits `join_room` with roomId
4. Client emits `send_message` with message
5. Chat Service → Redis (store in `chat:history:{roomId}`)
6. Chat Service → Redis pub/sub (broadcast to `chat:room:{roomId}`)
7. Other instances receive via Redis pub/sub → broadcast to their connected clients
8. All users in room receive `new_message` event

### 📝 Creating a Post
1. Client → Gateway `/posts/` (multipart/form-data) → Post Service
2. Post Service validates JWT (via Nginx → Auth verify)
3. Post Service → Cloudinary (upload media files)
4. Post Service → PostgreSQL (store post with media URLs)
5. Post Service → Kafka publish `post.created` to POST_TOPIC
6. Notification Service consumes → MongoDB (create notification for author)
7. Response → Client with post data

### 💬 Commenting on a Post
1. Client → Gateway `/posts/comment/:id` → Post Service
2. Post Service → PostgreSQL (store comment)
3. Post Service → Kafka publish `comment.created` to POST_TOPIC with recipientId
4. Notification Service consumes → MongoDB (notify post owner)
5. Response → Client with comment data

---

## 📦 Service Responsibilities

### **Auth Service** (Port: 5000)
* Handles login, signup, password reset with OTP.
* JWT issue + validation.
* PostgreSQL (users), Redis (OTP storage, session cache).
* REST endpoint `/api/v1/auth/verify-user` for token validation (called by Nginx).

### **User Service** (Port: 5003)
* Manages follow/unfollow relationships.
* PostgreSQL (users, follows with soft delete), Kafka producer.
* Just-in-time user creation on follow operations.
* Publishes events: `follow.created`, `unfollow.created` to USER_TOPIC.

### **Post Service** (Port: 5001)
* Stores posts, comments, likes in PostgreSQL (via Prisma).
* Uploads media → Cloudinary.
* Publishes events to POST_TOPIC: `post.created`, `comment.created`, `like.created`.
* Uses Multer for file uploads (max 10 files, 10MB each).

### **Feed Service** (Port: TBD)
* ⏳ Not yet implemented.
* Planned: Consumes `post.created` from Kafka.
* Planned: Fan-out to followers, build feeds.

### **Notification Service** (Port: 5002)
* Consumes Kafka events from POST_TOPIC and USER_TOPIC.
* Stores notifications in MongoDB (via Prisma).
* REST endpoint: GET `/notify/notifications` (auto-marks as read).
* Event handlers: post, comment, like, follow notifications.

### **Chat Service** (Port: 5004)
* Direct messages via Socket.IO (WebSocket).
* Message history stored in Redis (last 1000 messages, 7 days TTL).
* Redis pub/sub for multi-instance support.
* Socket events: authenticate, join_room, send_message, typing.
* REST endpoint: GET `/api/chat/:roomId/history`.

### **VC Service** (Port: TBD)
* ⏳ Not yet implemented.
* Planned: Video call sessions, signaling, presence.
* Planned: MongoDB (sessions), Redis (presence), STUN/TURN.

---

## 🗄 Database Choices & Current Implementation

* **PostgreSQL** → Auth (users), Users (follows), Posts (posts/comments/likes via Prisma)
* **MongoDB** → Notifications (via Prisma), Chat (planned, currently Redis only)
* **Redis** → Auth (OTP storage), Chat (message history, pub/sub), sessions
* **Cloudinary** → Media storage (images, videos) - replaces S3

### Database Technology Decisions
- **Auth Service**: PostgreSQL for structured user data
- **Users Service**: PostgreSQL for relational follow/unfollow data with soft deletes
- **Post Service**: PostgreSQL (via Prisma) - originally planned MongoDB but using PostgreSQL
- **Notification Service**: MongoDB for flexible schema and high-volume writes
- **Chat Service**: Redis for fast message history and pub/sub (MongoDB planned for persistence)

---

## 🛠 Dev & Deployment

### Local Dev

* Use **docker-compose** → run Postgres, Mongo, Redis, Kafka, RabbitMQ, all services.

### CI/CD

* GitHub Actions/GitLab CI → build, test, deploy.

### Production

* Kubernetes (k8s manifests in `infra/k8s`).
* Terraform for infra provisioning.
* Monitoring: Prometheus + Grafana.
* Logging: ELK stack.

---

## 📂 Common Utils (Shared Library)

* `middlewares/` → `authCheck` (via gRPC), `errorHandler`, `logger`
* `db.js` → DB connectors (Postgres, Mongo, Redis)
* `constants.js` → service names, topics, queues
* `logging.js` → centralized logger (Winston/Pino)

---

## ✅ Summary

### Current Architecture
* **REST APIs**: All client-facing services
* **Nginx Gateway**: Single entry point with auth verification
* **Kafka**: Event-driven communication (posts, comments, likes, follows)
* **Redis**: Chat message history, pub/sub for real-time, OTP storage
* **PostgreSQL**: Auth, Users, Posts (structured data)
* **MongoDB**: Notifications (flexible schema)
* **Cloudinary**: Media storage (images, videos)

### Technology Stack Actual vs Planned
| Component | Planned | Actual |
|-----------|---------|--------|
| Inter-service communication | gRPC | REST (via Nginx) |
| Post database | MongoDB | PostgreSQL (Prisma) |
| Media storage | S3/MinIO | Cloudinary |
| Message queue | Kafka + RabbitMQ | Kafka only |
| Chat persistence | MongoDB | Redis (MongoDB planned) |

This setup ensures **scalability, reliability, and performance** while keeping the frontend simple (just talks to Gateway).

---

## 📖 Service Documentation

Each service has its own detailed README.md:

- **[Gateway](./gateway/README.md)**: Nginx routing, authentication, endpoints
- **[Auth Service](./services/auth-service/README.md)**: Login, signup, JWT validation
- **[Users Service](./services/users-service/README.md)**: Follow/unfollow, relationships
- **[Post Service](./services/post-service/README.md)**: Posts, comments, likes, media
- **[Notification Service](./services/notification-service/README.md)**: Event consumers, notifications
- **[Chat Service](./services/chat-service/README.md)**: Real-time messaging, Socket.IO

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### Start All Services
```bash
# Clone repository
git clone <repo-url>
cd socialHub

# Start infrastructure and services
docker-compose up -d

# Services will be available at:
# - Gateway: http://localhost
# - Auth: http://localhost:5000
# - Users: http://localhost:5003
# - Posts: http://localhost:5001
# - Notifications: http://localhost:5002
# - Chat: http://localhost:5004
```

### Test the System
```bash
# 1. Register a user
curl -X POST http://localhost/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","username":"john","password":"test123"}'

# 2. Login
TOKEN=$(curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"john@test.com","password":"test123"}' \
  | jq -r '.token')

# 3. Create a post
curl -X POST http://localhost/posts/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "content=My first post!"

# 4. Get notifications
curl -X GET http://localhost/notify/notifications \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🛠 Development

### Run Individual Service
```bash
cd services/auth-service
npm install
npm run dev
```

### Run Database Migrations
```bash
cd services/auth-service
npx prisma migrate dev
```

### Start Kafka Consumer
```bash
cd services/notification-service
npm run consumers
```
