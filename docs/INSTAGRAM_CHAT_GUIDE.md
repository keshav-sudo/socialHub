# Instagram-Style Chat Implementation Guide 📱💬

## 📋 Overview

This is a complete Instagram-style Direct Messaging (DM) system with real-time messaging, conversation management, message status tracking, reactions, and more.

---

## ✨ Key Features

### 1. **Instagram-Style Conversations**
- Direct messages (DMs) between users
- Conversation list (inbox) with last message preview
- Unread message badges
- Conversation search

### 2. **Message Features**
- ✅ Text messages
- ✅ Image/Video/Audio/File support
- ✅ Message status (Sent → Delivered → Read)
- ✅ Delete/Unsend messages
- ✅ Reply to messages
- ✅ Message reactions (emoji)
- ✅ Message search
- ✅ Typing indicators

### 3. **Real-time Updates**
- Instant message delivery via WebSocket
- Live typing indicators
- Real-time read receipts
- Online/offline status
- Message delivery confirmations

### 4. **Privacy & Security**
- Only mutual followers can chat
- Authentication via Nginx gateway
- Message soft delete (unsend)
- Conversation privacy

---

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │ (Web/Mobile App)
└──────┬──────┘
       │ WebSocket/REST
       ↓
┌─────────────┐
│   Nginx     │ (Gateway - JWT Auth)
└──────┬──────┘
       │ x-user-payload header
       ↓
┌─────────────┐
│ Chat Service│
├─────────────┤
│ Socket.IO   │ ← Real-time messaging
│ REST API    │ ← HTTP endpoints
└──────┬──────┘
       │
       ├──→ MongoDB (Messages & Conversations)
       ├──→ Redis (Real-time pub/sub, caching)
       └──→ PostgreSQL (Users & Follow relationships)
```

---

## 🗄️ Database Schema

### MongoDB Collections

#### **conversations**
```javascript
{
  _id: ObjectId,
  conversation_id: "user1_user2",  // Sorted user IDs
  chat_type: "SINGLE" | "GROUP",
  participants: ["user1", "user2"],
  last_message: "Hello!",
  last_message_by: "user1",
  last_message_at: Date,
  created_at: Date,
  updated_at: Date
}
```

#### **messages**
```javascript
{
  _id: ObjectId,
  conversation_id: "user1_user2",
  message_type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE",
  sender_id: "user1",
  sender_username: "john_doe",
  content: "Hello!",
  media_url: "https://...",  // For images/videos
  status: "SENT" | "DELIVERED" | "READ",
  is_deleted: false,
  deleted_at: null,
  reactions: { "user2": "❤️", "user3": "👍" },
  reply_to: ObjectId,  // Reply to message ID
  created_at: Date
}
```

#### **unread_counts**
```javascript
{
  _id: ObjectId,
  conversation_id: "user1_user2",
  user_id: "user2",
  count: 5,
  last_read_at: Date
}
```

---

## 🔌 Socket.IO Events

### Client → Server Events

#### 1. **start_conversation**
Start a new conversation or get existing one
```javascript
socket.emit('start_conversation', {
  targetUserId: 'user123'
});

// Response:
socket.on('conversation_started', (data) => {
  // data = { conversation, messages }
});
```

#### 2. **join_conversation**
Join an existing conversation
```javascript
socket.emit('join_conversation', {
  conversationId: 'user1_user2'
});

// Response:
socket.on('message_history', (messages) => {
  // Array of messages
});
```

#### 3. **send_message**
Send a message in conversation
```javascript
socket.emit('send_message', {
  conversationId: 'user1_user2',
  content: 'Hello!',
  messageType: 'TEXT',  // Optional: TEXT, IMAGE, VIDEO
  mediaUrl: 'https://...',  // Optional
  replyTo: 'messageId'  // Optional: Reply to message
});

// Response:
socket.on('message_sent', (data) => {
  // { tempId, message }
});
```

#### 4. **mark_as_read**
Mark all messages in conversation as read
```javascript
socket.emit('mark_as_read', {
  conversationId: 'user1_user2'
});
```

#### 5. **delete_message**
Delete/unsend a message
```javascript
socket.emit('delete_message', {
  messageId: 'msg123',
  conversationId: 'user1_user2'
});
```

#### 6. **add_reaction**
Add emoji reaction to message
```javascript
socket.emit('add_reaction', {
  messageId: 'msg123',
  conversationId: 'user1_user2',
  emoji: '❤️'
});
```

#### 7. **remove_reaction**
Remove your reaction from message
```javascript
socket.emit('remove_reaction', {
  messageId: 'msg123',
  conversationId: 'user1_user2'
});
```

#### 8. **typing**
Send typing indicator
```javascript
socket.emit('typing', {
  conversationId: 'user1_user2',
  isTyping: true
});
```

#### 9. **get_conversations**
Get list of all conversations
```javascript
socket.emit('get_conversations');

// Response:
socket.on('conversations_list', (conversations) => {
  // Array of conversations with unread counts
});
```

#### 10. **load_more_messages**
Load older messages (pagination)
```javascript
socket.emit('load_more_messages', {
  conversationId: 'user1_user2',
  before: '2024-01-01T00:00:00Z',
  limit: 50
});

// Response:
socket.on('messages_loaded', (messages) => {
  // Older messages
});
```

### Server → Client Events

#### 1. **new_message**
Receive new message in conversation
```javascript
socket.on('new_message', (message) => {
  // Display message in UI
});
```

#### 2. **new_message_notification**
Notification for messages in other conversations
```javascript
socket.on('new_message_notification', (data) => {
  // { conversationId, message, unreadCount }
  // Show notification badge
});
```

#### 3. **user_typing**
Another user is typing
```javascript
socket.on('user_typing', (data) => {
  // { userId, username, conversationId, isTyping }
});
```

#### 4. **messages_read**
Someone read your messages
```javascript
socket.on('messages_read', (data) => {
  // { conversationId, userId }
  // Update UI to show "Read"
});
```

#### 5. **message_deleted**
A message was deleted
```javascript
socket.on('message_deleted', (data) => {
  // { messageId, conversationId }
  // Remove from UI
});
```

#### 6. **reaction_added**
Someone reacted to a message
```javascript
socket.on('reaction_added', (data) => {
  // { messageId, userId, emoji, reactions }
});
```

#### 7. **user_online**
User came online in conversation
```javascript
socket.on('user_online', (data) => {
  // { userId, username }
});
```

---

## 🌐 REST API Endpoints

All endpoints require authentication via `Authorization: Bearer <token>` header.

### Conversations

#### 1. **Get All Conversations** (Inbox)
```http
GET /api/chat/conversations?limit=50

Response:
{
  "success": true,
  "conversations": [
    {
      "conversationId": "user1_user2",
      "participants": ["user1", "user2"],
      "lastMessage": "Hello!",
      "lastMessageBy": "user1",
      "lastMessageAt": "2024-01-01T00:00:00Z",
      "unreadCount": 3
    }
  ]
}
```

#### 2. **Start Conversation**
```http
POST /api/chat/conversations/start
Content-Type: application/json

{
  "targetUserId": "user123"
}

Response:
{
  "success": true,
  "conversation": { ... }
}
```

#### 3. **Delete Conversation**
```http
DELETE /api/chat/conversations/:conversationId

Response:
{
  "success": true,
  "message": "Conversation deleted"
}
```

### Messages

#### 4. **Get Messages**
```http
GET /api/chat/conversations/:conversationId/messages?limit=50&before=2024-01-01

Response:
{
  "success": true,
  "messages": [ ... ]
}
```

#### 5. **Send Message**
```http
POST /api/chat/conversations/:conversationId/messages
Content-Type: application/json

{
  "content": "Hello!",
  "messageType": "TEXT",
  "mediaUrl": "https://...",  // Optional
  "replyTo": "messageId"      // Optional
}

Response:
{
  "success": true,
  "message": { ... }
}
```

#### 6. **Delete Message**
```http
DELETE /api/chat/messages/:messageId

Response:
{
  "success": true,
  "message": "Message deleted"
}
```

#### 7. **Add Reaction**
```http
POST /api/chat/messages/:messageId/reactions
Content-Type: application/json

{
  "emoji": "❤️"
}

Response:
{
  "success": true,
  "reactions": { "user1": "❤️", "user2": "👍" }
}
```

#### 8. **Remove Reaction**
```http
DELETE /api/chat/messages/:messageId/reactions

Response:
{
  "success": true,
  "reactions": { ... }
}
```

#### 9. **Mark as Read**
```http
POST /api/chat/conversations/:conversationId/read

Response:
{
  "success": true,
  "message": "Marked as read"
}
```

#### 10. **Get Unread Count**
```http
GET /api/chat/unread-count

Response:
{
  "success": true,
  "unreadCount": 10
}
```

#### 11. **Search Messages**
```http
GET /api/chat/conversations/:conversationId/search?q=hello&limit=20

Response:
{
  "success": true,
  "messages": [ ... ]
}
```

#### 12. **Get Media Messages**
```http
GET /api/chat/conversations/:conversationId/media?limit=20

Response:
{
  "success": true,
  "messages": [ ... ]  // Only IMAGE and VIDEO messages
}
```

### Users

#### 13. **Get Chatable Users**
Get list of users you can chat with (mutual followers)
```http
GET /api/chat/chatable-users

Response:
{
  "success": true,
  "chatableUsers": ["user1", "user2", "user3"],
  "count": 3
}
```

---

## 🚀 Quick Start

### 1. **Client Setup (JavaScript)**

```javascript
import io from 'socket.io-client';

// Connect to chat service
const socket = io('http://localhost:8080', {
  path: '/socket.io',
  auth: {
    token: 'Bearer YOUR_JWT_TOKEN'
  }
});

// Connection events
socket.on('connect', () => {
  console.log('Connected to chat!');
});

socket.on('error', (error) => {
  console.error('Chat error:', error);
});

// Start conversation
socket.emit('start_conversation', {
  targetUserId: 'user123'
});

socket.on('conversation_started', ({ conversation, messages }) => {
  console.log('Conversation:', conversation);
  console.log('Messages:', messages);
  
  // Join the conversation room
  socket.emit('join_conversation', {
    conversationId: conversation.conversationId
  });
});

// Listen for new messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
  // Update UI
});

// Send message
function sendMessage(conversationId, content) {
  socket.emit('send_message', {
    conversationId,
    content,
    messageType: 'TEXT'
  });
}

// Typing indicator
function setTyping(conversationId, isTyping) {
  socket.emit('typing', {
    conversationId,
    isTyping
  });
}

// Mark as read
function markAsRead(conversationId) {
  socket.emit('mark_as_read', {
    conversationId
  });
}

// React to message
function reactToMessage(messageId, conversationId, emoji) {
  socket.emit('add_reaction', {
    messageId,
    conversationId,
    emoji
  });
}
```

### 2. **React Hook Example**

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function useChat(token) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:8080', {
      path: '/socket.io',
      auth: { token: `Bearer ${token}` }
    });

    newSocket.on('connect', () => {
      console.log('Connected!');
      newSocket.emit('get_conversations');
    });

    newSocket.on('conversations_list', (convs) => {
      setConversations(convs);
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [token]);

  const sendMessage = (conversationId, content) => {
    socket?.emit('send_message', { conversationId, content });
  };

  const startConversation = (targetUserId) => {
    socket?.emit('start_conversation', { targetUserId });
  };

  return {
    socket,
    messages,
    conversations,
    sendMessage,
    startConversation
  };
}
```

---

## 🎨 UI Flow (Instagram Style)

### 1. **Inbox/Conversations List**
```
┌─────────────────────────────┐
│ Direct Messages        (3)  │ ← Unread badge
├─────────────────────────────┤
│ 🟢 John Doe                 │
│    Hey! How are you?  • 2m  │ ← Last message & time
├─────────────────────────────┤
│ ⚫ Jane Smith           (2) │ ← Unread count
│    See you tomorrow!  • 1h  │
├─────────────────────────────┤
│ 🟢 Mike Johnson             │
│    👍 • 3h                  │ ← Reaction as last message
└─────────────────────────────┘
```

### 2. **Chat Screen**
```
┌─────────────────────────────┐
│ < John Doe          🟢      │ ← Back & Online status
├─────────────────────────────┤
│                             │
│  Hello! How are you?        │ ← Received message
│  10:30 AM                   │
│                             │
│            I'm good! ❤️     │ ← Sent message with reaction
│            10:31 AM • Read  │ ← Status
│                             │
│  john is typing...          │ ← Typing indicator
│                             │
├─────────────────────────────┤
│ [Aa] Type a message...  [📷]│ ← Input & media button
└─────────────────────────────┘
```

---

## 📊 Message Status Flow

```
1. User sends message
   └─→ Status: SENT ✓

2. Message delivered to recipient's device
   └─→ Status: DELIVERED ✓✓

3. Recipient opens and reads message
   └─→ Status: READ ✓✓ (blue ticks)
```

---

## 🔒 Security & Privacy

### 1. **Mutual Follow Check**
- Users can ONLY chat if they follow each other
- Checked on every action (start conversation, send message, etc.)

### 2. **Authentication**
- All requests authenticated via Nginx gateway
- JWT token verified before reaching chat service
- User info injected in `x-user-payload` header

### 3. **Message Privacy**
- Messages are soft-deleted (unsend feature)
- Only participants can see conversation
- No message history for blocked users

---

## 🧪 Testing Examples

### Using cURL:

```bash
# Get conversations
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/chat/conversations

# Start conversation
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetUserId":"user123"}' \
  http://localhost:8080/api/chat/conversations/start

# Send message
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello!","messageType":"TEXT"}' \
  http://localhost:8080/api/chat/conversations/user1_user2/messages

# Get unread count
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/chat/unread-count
```

---

## 🐛 Troubleshooting

### Issue: "Cannot chat with this user"
**Cause:** Users don't follow each other  
**Solution:** Both users must follow each other (mutual follow required)

### Issue: Messages not received in real-time
**Cause:** Not connected via WebSocket  
**Solution:** Ensure Socket.IO connection is established

### Issue: Unread count not updating
**Cause:** Need to call `mark_as_read`  
**Solution:** Call `mark_as_read` when user views conversation

---

## 📈 Performance Tips

1. **Pagination**: Always use pagination for message history
2. **Lazy Loading**: Load conversations on-demand
3. **Message Limit**: Keep message history limited (e.g., last 100)
4. **Media Optimization**: Compress images/videos before sending
5. **Connection Pooling**: Reuse Socket.IO connections

---

## 🎯 Differences from Original Implementation

| Feature | Old Implementation | New (Instagram Style) |
|---------|-------------------|----------------------|
| Conversation Management | ❌ Basic rooms | ✅ Full conversation tracking |
| Unread Count | ❌ None | ✅ Per-conversation unread badges |
| Message Status | ❌ None | ✅ Sent/Delivered/Read |
| Delete Messages | ❌ None | ✅ Unsend feature |
| Reactions | ❌ None | ✅ Emoji reactions |
| Reply to Messages | ❌ None | ✅ Reply/quote feature |
| Media Messages | ❌ None | ✅ Images/Videos/Files |
| Search | ❌ None | ✅ Message search |
| Conversation List | ❌ None | ✅ Instagram-style inbox |

---

## 🚀 Next Steps / Future Enhancements

- [ ] Voice messages
- [ ] Video calls integration
- [ ] Message forwarding
- [ ] Starred/Saved messages
- [ ] Group chats (already supported in schema)
- [ ] Message encryption (E2E)
- [ ] Push notifications
- [ ] Message delivery queue for offline users
- [ ] GIF support
- [ ] Stickers
- [ ] Location sharing

---

**Built with ❤️ for SocialHub - Instagram-style messaging at scale!**
