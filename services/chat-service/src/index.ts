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


// Socket.IO middleware for authentication (using nginx headers)
io.use(async (socket, next) => {
  try {
    // Get user payload from nginx header (set by nginx after auth verification)
    const userPayloadHeader = socket.handshake.headers['x-user-payload'] as string;
    
    if (!userPayloadHeader) {
      console.log('No user payload in headers - request must come through nginx');
      return next(new Error('Authentication error: No user data'));
    }

    const userPayload = JSON.parse(userPayloadHeader);

    // Attach user data to socket
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

// Import routes
import chatRoutes from './routes/chatRoutes.js';

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    service: 'chat-service', 
    redis: redisClient.status, 
    socket_adapter: io.of('/').adapter.constructor.name 
  });
});

// Use chat routes
app.use('/api/chat', chatRoutes);

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