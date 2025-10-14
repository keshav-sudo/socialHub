# Notification Service

## Overview
Handles real-time notifications for users, consuming events from Post and Chat services. Supports push notifications, in-app notifications, and email notifications.

## Architecture

```
Post Service → Kafka → Notification Service → PostgreSQL (notifications)
                                            → RabbitMQ (consume events)
                                            → WebSocket (push to clients)
                                            → Email Service
                                            
Chat Service → RabbitMQ → Notification Service
```

## Technology Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB via Prisma (not PostgreSQL)
- **Message Queue**: Kafka (consuming post/user events)
- **Real-time**: Planned (WebSocket / SSE)
- **Email**: Planned (Nodemailer / SendGrid)

## Port
- **5002**: HTTP REST API

## Database Schema (Prisma + MongoDB)

### Notifications Model
```prisma
model Notifications {
  id            String           @id @default(auto()) @map("_id") @db.ObjectId
  userId        String
  username      String?
  postId        String?
  commentId     String?
  likeId        String?
  followerId    String?
  followingId   String?
  type          NotificationType
  triggeredById String
  message       String
  link          String?
  is_read       Boolean          @default(false)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
}

enum NotificationType {
  POST
  CONNECTION
  ENGAGEMENT
  PROFILE
}
```

**Note**: MongoDB is used for flexible schema and high-volume writes.

## API Endpoints

### 1. Get User Notifications
```http
GET /notify/notifications
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Fetched and marked 10 notifications as read.",
  "data": [
    {
      "id": "notif-id",
      "type": "ENGAGEMENT",
      "message": "New comment on your post!",
      "username": "john_doe",
      "triggeredById": "user-uuid",
      "postId": "post-id",
      "commentId": "comment-id",
      "is_read": true,
      "createdAt": "2024-10-14T06:30:00Z"
    }
  ]
}
```

**Note**: This endpoint automatically marks all fetched notifications as read. It returns the last 50 unread notifications.

**Note**: Currently, the service only implements the GET notifications endpoint. Other endpoints (mark as read individually, delete, preferences) are planned for future implementation.

## Environment Variables

```env
# Server
PORT=5002
NODE_ENV=production

# Database (MongoDB)
DATABASE_URL=mongodb://mongo:27017/notifications_db

# Kafka
KAFKA_BROKER=kafka:9092
KAFKA_CLIENT_ID=notification-service
GROUP_ID=notification-group
TOPICS=POST_TOPIC,USER_TOPIC
```

## Event Consumers (Kafka)

### Topics Subscribed
1. **POST_TOPIC**: Post-related events (post.created, comment.created, like.created)
2. **USER_TOPIC**: User-related events (follow.created)

### Consumer Configuration
```typescript
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:9092'],
  retry: { retries: 5 }
});

const consumer = kafka.consumer({
  groupId: 'notification-group'
});

await consumer.subscribe({ 
  topics: ['POST_TOPIC', 'USER_TOPIC'], 
  fromBeginning: true 
});
```

## Event Handling

### 1. Post Created Event
```json
{
  "eventType": "post.created",
  "data": {
    "postId": "post-id",
    "authorId": "user-uuid",
    "username": "john_doe"
  }
}
```
**Action**: Creates a notification for the post author: "You created a new post!"

### 2. Comment Created Event
```json
{
  "eventType": "comment.created",
  "data": {
    "commentId": "comment-id",
    "postId": "post-id",
    "authorId": "commenter-uuid",
    "recipientId": "post-owner-uuid",
    "authorUsername": "jane_doe",
    "createdAt": "2024-10-14T06:30:00Z"
  }
}
```
**Action**: Notifies post owner: "jane_doe commented on your post!"

### 3. Like Created Event
```json
{
  "eventType": "like.created",
  "data": {
    "likeId": "like-id",
    "postId": "post-id",
    "authorId": "liker-uuid",
    "recipientId": "post-owner-uuid"
  }
}
```
**Action**: Notifies post owner: "Someone liked your post!"

### 4. Follow Created Event
```json
{
  "eventType": "follow.created",
  "data": {
    "followingId": "followed-user-uuid",
    "authorId": "follower-uuid",
    "newfollower": "john_doe",
    "followedUsername": "jane_doe"
  }
}
```
**Action**: Notifies followed user: "john_doe started following you!"

## Testing APIs

### Using cURL

```bash
TOKEN="your-jwt-token-here"

# Get notifications (auto marks as read)
curl -X GET http://localhost/notify/notifications \
  -H "Authorization: Bearer $TOKEN"
```

### Start the Consumer

The Kafka consumer must be started separately:

```bash
# In notification service
npm run consumers
# or
node dist/consumers/kafkaConsumer.js
```

## Notification Delivery Channels

### 1. In-App Notifications
- ✅ **Implemented**: Stored in MongoDB
- ✅ **Implemented**: Retrieved via REST API
- ⏳ **Planned**: Real-time via WebSocket/SSE

### 2. Email Notifications
- ⏳ **Planned**: Email templates
- ⏳ **Planned**: SMTP integration

### 3. Push Notifications
- ⏳ **Planned**: Firebase Cloud Messaging (FCM)
- ⏳ **Planned**: Apple Push Notification Service (APNS)
- ⏳ **Planned**: Web Push API

## Consumer Implementation

### Kafka Consumer Setup
```javascript
const consumer = kafka.consumer({ 
  groupId: 'notification-service' 
});

await consumer.subscribe({ 
  topic: 'new_post', 
  fromBeginning: false 
});

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value);
    await handleNewPostEvent(event);
  }
});
```

### RabbitMQ Consumer Setup
```javascript
const connection = await amqp.connect(process.env.RABBITMQ_URL);
const channel = await connection.createChannel();
await channel.assertQueue('new_message');

channel.consume('new_message', async (msg) => {
  const event = JSON.parse(msg.content.toString());
  await handleNewMessageEvent(event);
  channel.ack(msg);
});
```

## Business Logic

### Create Notification Flow
1. Receive event from Kafka/RabbitMQ
2. Extract user IDs to notify (e.g., all followers)
3. Check user notification preferences
4. Create notification records in database
5. Send email if enabled
6. Send push notification if enabled
7. Broadcast via WebSocket if user is online

### Performance Optimization
- Batch insert notifications for multiple users
- Async email sending (queue)
- Cache user preferences in Redis
- Paginate notification list
- Archive old notifications (30+ days)

## Security

- **Authentication**: All endpoints require valid JWT
- **Authorization**: Users can only access their own notifications
- **Rate Limiting**: 100 requests per minute per user
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Sanitize notification content

## Error Codes

- **400**: Bad Request (invalid parameters)
- **401**: Unauthorized (invalid token)
- **403**: Forbidden (not notification owner)
- **404**: Not Found (notification not found)
- **429**: Too Many Requests (rate limit)
- **500**: Internal Server Error

## Monitoring & Health Check

```bash
curl http://localhost:5002/health

Response:
{
  "status": "ok",
  "service": "notification-service",
  "timestamp": "2024-10-14T06:30:00Z",
  "database": "connected",
  "kafka": "connected",
  "rabbitmq": "connected"
}
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run consumers
npm run consumers

# Build
npm run build

# Run in production
npm start

# Run tests
npm test

# Run database migrations
npx prisma migrate dev
```

## Dependencies

```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "@prisma/client": "^5.7.0",
  "kafkajs": "^2.2.4",
  "amqplib": "^0.10.3",
  "nodemailer": "^6.9.7",
  "ioredis": "^5.3.2",
  "@grpc/grpc-js": "^1.9.13",
  "joi": "^17.11.0"
}
```

## Database Queries

### Get User Notifications with Pagination
```sql
SELECT * FROM notifications
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;
```

### Get Unread Count
```sql
SELECT COUNT(*) FROM notifications
WHERE user_id = $1 AND is_read = FALSE;
```

### Mark All as Read
```sql
UPDATE notifications
SET is_read = TRUE, read_at = NOW()
WHERE user_id = $1 AND is_read = FALSE;
```

## Future Enhancements

- Real-time WebSocket notifications
- Push notifications (FCM, APNS)
- Notification grouping (e.g., "5 people liked your post")
- Digest emails (daily/weekly summary)
- Notification scheduling
- Rich notifications with images
- Custom notification sounds
- Do Not Disturb mode
- Notification analytics
- A/B testing for notification content
