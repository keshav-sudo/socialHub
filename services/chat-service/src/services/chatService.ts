import { Server as SocketIOServer, Socket } from 'socket.io';
import { redisPublisher, redisSubscriber } from '../config/redis.js';

interface ChatMessage {
  roomId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export class ChatService {
  private io: SocketIOServer;
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupRedisSubscriber();
  }

  private setupRedisSubscriber() {
    redisSubscriber.on('message', (channel: string, message: string) => {
      if (channel.startsWith('chat:')) {
        const roomId = channel.split(':')[1];
        const data: ChatMessage = JSON.parse(message);
        
        // Broadcast to all clients in this room
        if (roomId) {
          this.io.to(roomId).emit('message', data);
        }
      }
    });
  }

  async joinRoom(socket: Socket, roomId: string, userId: string) {
    socket.join(roomId);
    
    // Track user sockets
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)?.add(socket.id);

    // Subscribe to room channel
    await redisSubscriber.subscribe(`chat:${roomId}`);
    
    console.log(`User ${userId} joined room ${roomId}`);
    
    // Notify others in room
    socket.to(roomId).emit('user_joined', {
      userId,
      roomId,
      timestamp: Date.now(),
    });
  }

  async leaveRoom(socket: Socket, roomId: string, userId: string) {
    socket.leave(roomId);
    
    // Remove socket from tracking
    const userSocketSet = this.userSockets.get(userId);
    if (userSocketSet) {
      userSocketSet.delete(socket.id);
      if (userSocketSet.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    console.log(`User ${userId} left room ${roomId}`);
    
    // Notify others in room
    socket.to(roomId).emit('user_left', {
      userId,
      roomId,
      timestamp: Date.now(),
    });
  }

  async sendMessage(data: ChatMessage) {
    const { roomId, userId, username, message } = data;
    
    const chatMessage: ChatMessage = {
      roomId,
      userId,
      username,
      message,
      timestamp: Date.now(),
    };

    // Publish to Redis (other instances will receive this)
    await redisPublisher.publish(
      `chat:${roomId}`,
      JSON.stringify(chatMessage)
    );

    // Store message in Redis for history (optional)
    await redisPublisher.lpush(
      `chat:history:${roomId}`,
      JSON.stringify(chatMessage)
    );
    
    // Keep only last 100 messages
    await redisPublisher.ltrim(`chat:history:${roomId}`, 0, 99);

    return chatMessage;
  }

  async getMessageHistory(roomId: string, limit: number = 50) {
    const messages = await redisPublisher.lrange(
      `chat:history:${roomId}`,
      0,
      limit - 1
    );
    
    return messages.map((msg: string) => JSON.parse(msg)).reverse();
  }

  async getRoomUsers(roomId: string): Promise<string[]> {
    const sockets = await this.io.in(roomId).fetchSockets();
    return sockets.map(s => s.data.userId).filter(Boolean);
  }
}
