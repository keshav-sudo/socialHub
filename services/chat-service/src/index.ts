// chat-service/src/server.ts (मुख्य फाइल)

import express from "express";
import  type {Response , Request} from "express"
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter'; // <-- New import
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSocketHandlers } from './socket/socketHandler.js';
// Updated imports for all clients
import { redisClient, redisPublisher, redisSubscriber } from './config/redis.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure Socket.IO with CORS
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  connectTimeout: 10000,
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true,
});

// **********************************************
// 1. SCALING: Apply Socket.IO Redis Adapter
// **********************************************
io.adapter(createAdapter(redisPublisher, redisSubscriber));


// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
    
    if (!token) {
      console.log('No token provided in handshake');
      return next(new Error('Authentication error: No token provided'));
    }

    // Extract token from "Bearer <token>" format
    const bearerToken = token.replace('Bearer ', '').trim();

    // Verify token with auth service
    const response = await fetch(`http://auth-service:5000/api/v1/auth/verify-user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      console.log('Auth service returned non-OK status:', response.status);
      return next(new Error('Authentication error: Invalid token'));
    }

    // Get user payload from response header
    const userPayloadHeader = response.headers.get('x-user-payload');
    if (!userPayloadHeader) {
      console.log('No user payload in response header');
      return next(new Error('Authentication error: No user data'));
    }

    const userPayload = JSON.parse(userPayloadHeader);

    // Attach user data to socket (auth service returns 'id', not 'userId')
    socket.data.userId = userPayload.id || userPayload.userId;
    socket.data.username = userPayload.username;

    console.log(`Socket authenticated: ${socket.data.userId} (${socket.data.username})`);
    next();
  } catch (error: any) {
    console.log('Token verification failed:', error.message);
    next(new Error('Authentication error: ' + error.message));
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    service: 'chat-service', 
    redis: redisClient.status, 
    socket_adapter: io.of('/').adapter.constructor.name 
  });
});

// REST API endpoint to get room history
app.get('/api/chat/:roomId/history', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const messages = await redisClient.lrange(`chat:history:${roomId}`, 0, limit - 1);
    const history = messages.map((msg) => JSON.parse(msg)).reverse();
    
    res.json({ success: true, messages: history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// REST API endpoint to send message (for Postman testing)
app.post('/api/chat/:roomId/message', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { message, userId, username } = req.body;
    
    if (!message || !userId || !username) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: message, userId, username' 
      });
    }
    
    const messageData = {
      roomId,
      userId,
      username,
      message,
      timestamp: Date.now(),
    };
    
    // Save to Redis
    await redisClient.lpush(`chat:history:${roomId}`, JSON.stringify(messageData));
    await redisClient.ltrim(`chat:history:${roomId}`, 0, 99);
    
    // Emit to all connected clients in the room
    io.to(roomId).emit('message', messageData);
    
    res.json({ success: true, message: 'Message sent', data: messageData });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// REST API endpoint to get room users
app.get('/api/chat/:roomId/users', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const userIds = await redisClient.smembers(`room:${roomId}:users`);
    
    res.json({ success: true, roomId, userCount: userIds.length, users: userIds });
  } catch (error) {
    console.error('Error fetching room users:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// REST API endpoint to get Socket.IO connection info
app.get('/api/socket-info', (req: Request, res: Response) => {
  const sockets = io.sockets.sockets;
  const connections = Array.from(sockets.values()).map(socket => ({
    id: socket.id,
    userId: socket.data.userId,
    username: socket.data.username,
    rooms: Array.from(socket.rooms).filter(room => room !== socket.id),
    connected: socket.connected,
  }));
  
  res.json({ 
    success: true, 
    totalConnections: sockets.size,
    connections 
  });
});

// Add connection error handling
io.engine.on('connection_error', (err) => {
  console.error('Connection error:', err.code, err.message, err.context);
});

// Setup Socket.IO handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 5004;

httpServer.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});

// **********************************************
// 2. GRACEFUL SHUTDOWN IMPROVEMENT
// **********************************************
process.on('SIGTERM', () => {
  console.log('SIGTERM received, starting graceful shutdown...');
  
  // Close the Socket.IO server first to stop new connections
  io.close(async () => {
    console.log('Socket.IO server closed.');
    
    // Close HTTP server
    httpServer.close(async () => {
      console.log('HTTP server closed.');
      
      // Quit Redis connections
      await redisClient.quit();
      await redisPublisher.quit();
      await redisSubscriber.quit();
      console.log('All Redis clients quit.');
      
      process.exit(0);
    });
  });
});