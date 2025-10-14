# Chat Service with Redis Pub/Sub

Real-time chat service using Socket.IO and Redis pub/sub for horizontal scaling.

## Features

- ✅ Real-time messaging with WebSocket (Socket.IO)
- ✅ Redis pub/sub for multi-instance support
- ✅ Chat rooms support
- ✅ Message history (stored in Redis)
- ✅ Typing indicators
- ✅ User join/leave notifications
- ✅ REST API for message history

## Architecture

```
Client 1 -> Socket.IO -> Chat Service Instance 1 
                              ↓
                         Redis Pub/Sub
                              ↓
Client 2 <- Socket.IO <- Chat Service Instance 2
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5004
REDIS_HOST=redis
REDIS_PORT=6379
CORS_ORIGIN=*
```

3. Build the project:
```bash
npm run build
```

4. Start the service:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Socket.IO Events

### Client to Server

#### `authenticate`
Authenticate the user connection.
```javascript
socket.emit('authenticate', {
  userId: 'user123',
  username: 'John Doe'
});
```

#### `join_room`
Join a chat room.
```javascript
socket.emit('join_room', {
  roomId: 'room1'
});
```

#### `leave_room`
Leave a chat room.
```javascript
socket.emit('leave_room', {
  roomId: 'room1'
});
```

#### `send_message`
Send a message to a room.
```javascript
socket.emit('send_message', {
  roomId: 'room1',
  message: 'Hello everyone!'
});
```

#### `typing`
Send typing indicator.
```javascript
socket.emit('typing', {
  roomId: 'room1',
  isTyping: true
});
```

### Server to Client

#### `message_history`
Receive message history when joining a room.
```javascript
socket.on('message_history', (messages) => {
  console.log('History:', messages);
});
```

#### `message`
Receive a new message.
```javascript
socket.on('message', (data) => {
  console.log('New message:', data);
  // data: { roomId, userId, username, message, timestamp }
});
```

#### `user_joined`
User joined the room notification.
```javascript
socket.on('user_joined', (data) => {
  console.log('User joined:', data);
});
```

#### `user_left`
User left the room notification.
```javascript
socket.on('user_left', (data) => {
  console.log('User left:', data);
});
```

#### `user_typing`
Typing indicator from other users.
```javascript
socket.on('user_typing', (data) => {
  console.log('User typing:', data);
  // data: { userId, username, isTyping }
});
```

#### `room_users`
Current users in the room.
```javascript
socket.on('room_users', (users) => {
  console.log('Room users:', users);
});
```

#### `error`
Error messages.
```javascript
socket.on('error', (error) => {
  console.error('Error:', error);
});
```

## REST API

### Get Message History
```
GET /api/chat/:roomId/history?limit=50
```

Response:
```json
{
  "success": true,
  "messages": [
    {
      "roomId": "room1",
      "userId": "user123",
      "username": "John Doe",
      "message": "Hello!",
      "timestamp": 1234567890
    }
  ]
}
```

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "chat-service"
}
```

## Client Example

See `src/client-example.html` for a complete HTML/JavaScript client example.

To test:
1. Open the HTML file in a browser
2. Fill in userId, username, and roomId
3. Click "Connect"
4. Start chatting!

Open multiple browser windows to test real-time messaging.

## Docker

Build and run with Docker:
```bash
docker build -t chat-service .
docker run -p 5004:5004 --env-file .env chat-service
```

Or use docker-compose:
```bash
docker-compose up chat-service
```

## How Redis Pub/Sub Works

1. **Publishing Messages**: When a user sends a message, it's published to a Redis channel specific to that room (`chat:roomId`)

2. **Subscribing to Channels**: Each chat service instance subscribes to room channels when users join rooms

3. **Broadcasting**: When Redis receives a message, all subscribed instances receive it and broadcast to their connected clients

4. **Scaling**: You can run multiple instances of the chat service, and they'll all stay in sync via Redis pub/sub

## Message Storage

- Messages are stored in Redis lists (`chat:history:roomId`)
- Only the last 100 messages per room are kept
- For persistent storage, integrate with a database

## Testing

To test the chat service:

1. Start Redis:
```bash
docker-compose up redis
```

2. Start the chat service:
```bash
npm run dev
```

3. Open `src/client-example.html` in multiple browser windows

4. Connect with different users and start chatting!

## Production Considerations

1. **Authentication**: Integrate with your auth service for token-based authentication
2. **Database**: Store messages in PostgreSQL/MongoDB for persistence
3. **Rate Limiting**: Add rate limiting to prevent spam
4. **Message Validation**: Validate and sanitize messages
5. **File Uploads**: Add support for image/file sharing
6. **Read Receipts**: Track message read status
7. **Encryption**: Implement end-to-end encryption for sensitive messages
