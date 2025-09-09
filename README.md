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

* Always goes through **Gateway**.
* Uses **REST (JSON over HTTP)**.

### 2. **Service → Service (Internal)**

* For token validation, user info lookup → **gRPC**.
* For async events → **Kafka/RabbitMQ**.

### 3. **Event-driven (Pub/Sub)**

* **Post → Feed Service** (Kafka)
* **Post → Notification Service** (Kafka)
* **Chat → Notification Service** (RabbitMQ)
* **VC → Presence updates** (Redis Pub/Sub)

---

## ⚡ Example Request Flows

### 🔑 User Login

1. Client → Gateway → Auth Service `/login`
2. Auth Service → Postgres (check user) → issue JWT
3. JWT stored in Redis (blacklist/refresh)
4. Response → Client (JWT)

### 💬 Sending a Chat Message

1. Client → Gateway → Chat Service `/sendMessage`
2. Chat Service → Auth Service (gRPC ValidateToken)
3. Chat Service → MongoDB (store message)
4. Chat Service → Redis Pub/Sub (notify receiver if online)
5. Chat Service → RabbitMQ publish `new_message`
6. Notification Service consume → Postgres insert → WebSocket push to receiver

### 📝 Creating a Post

1. Client → Gateway → Post Service `/createPost`
2. Post Service → MongoDB + S3 (store content)
3. Post Service → Kafka publish `new_post`
4. Feed Service consume → update follower feeds (Postgres + Redis)
5. Notification Service consume → insert notification (Postgres)

---

## 📦 Service Responsibilities

### **Auth Service**

* Handles login, signup, refresh tokens.
* JWT issue + validation.
* Postgres (users, tokens), Redis (blacklist, session cache).
* Exposes **gRPC ValidateToken** for other services.

### **User Service**

* Manages profiles, settings, followers.
* Postgres (users, relationships), Redis (cache).

### **Post Service**

* Stores posts, comments, media in MongoDB.
* Uploads media → S3.
* Publishes `new_post` to Kafka.
* Redis used for post cache.

### **Feed Service**

* Consumes `new_post` from Kafka.
* Fan-out to followers.
* Postgres (feeds), Redis (cached timelines).

### **Notification Service**

* Consumes Kafka + RabbitMQ events.
* Stores notifications (Postgres).
* Pushes real-time updates (WebSockets).

### **Chat Service**

* Direct messages in MongoDB.
* Uses Redis pub/sub for realtime delivery.
* Publishes `new_message` to RabbitMQ.
* Validates tokens via Auth gRPC.

### **VC Service**

* Manages video call sessions.
* MongoDB (sessions), Redis (presence).
* Uses STUN/TURN for connectivity.

---

## 🗄 Database Choices

* **Postgres** → Auth, User, Feed, Notification (relational, structured data).
* **MongoDB** → Post, Chat, VC (flexible, nested, high-volume writes).
* **Redis** → Cache, presence, sessions, rate limiting.
* **S3/Blob storage** → Media (images, videos).

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

* REST = client-facing
* gRPC = internal service-to-service
* Kafka/RabbitMQ = async events
* Redis = cache, presence, sessions
* Postgres = structured data
* MongoDB = flexible, content-heavy data
* S3 = media

This setup ensures **scalability, reliability, and performance** while keeping frontend simple (just talks to Gateway).

---

👉 Next Steps: Create **per-service mini READMEs** (Auth, Chat, Post etc.) with endpoints, DB schema, and gRPC contracts.
