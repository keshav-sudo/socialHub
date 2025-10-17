import { Request, Response } from 'express';
import { redisClient } from '../config/redis.js';
import { getIoInstance } from '../socket/socketHandler.js';
import { FollowService } from '../services/followService.js';

export class ChatController {
  private followService: FollowService;

  constructor() {
    this.followService = new FollowService();
  }

  // Get chat room history
  async getHistory(req: Request, res: Response) {
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
  }

  // Send message via REST API
  async sendMessage(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const { message, userId, username, targetUserId } = req.body;
      
      if (!message || !userId || !username) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: message, userId, username' 
        });
      }

      // Check if users follow each other for one-to-one chat
      if (targetUserId) {
        const canChat = await this.followService.canUsersChat(userId, targetUserId);
        if (!canChat) {
          return res.status(403).json({
            success: false,
            error: 'Cannot send message. You must follow each other to chat.'
          });
        }
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
      const io = getIoInstance();
      io.to(roomId).emit('message', messageData);
      
      res.json({ success: true, message: 'Message sent', data: messageData });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  }

  // Get room users
  async getRoomUsers(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const userIds = await redisClient.smembers(`room:${roomId}:users`);
      
      res.json({ success: true, roomId, userCount: userIds.length, users: userIds });
    } catch (error) {
      console.error('Error fetching room users:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  }

  // Get users that can be chatted with (mutual follows)
  async getChatableUsers(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }

      const chatableUsers = await this.followService.getChatableUsers(userId);
      
      res.json({ 
        success: true, 
        userId,
        chatableUsers,
        count: chatableUsers.length
      });
    } catch (error) {
      console.error('Error fetching chatable users:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch chatable users' });
    }
  }

  // Get socket info
  async getSocketInfo(req: Request, res: Response) {
    try {
      const io = getIoInstance();
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
    } catch (error) {
      console.error('Error fetching socket info:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch socket info' });
    }
  }
}
