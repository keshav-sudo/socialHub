import { Request, Response } from 'express';
import { redisClient } from '../config/redis.js';
import { getIoInstance } from '../socket/socketHandler.js';
import { FollowService } from '../services/followService.js';
import { ConversationService } from '../services/conversationService.js';
import { MessageService } from '../services/messageService.js';

export class ChatController {
  private followService: FollowService;
  private conversationService: ConversationService;
  private messageService: MessageService;

  constructor() {
    this.followService = new FollowService();
    this.conversationService = new ConversationService();
    this.messageService = new MessageService();
  }

  // Start a new conversation or get existing one
  async getConversations(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const conversations = await this.conversationService.getUserConversations(user.userId, limit);
      
      res.json({ success: true, conversations });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
    }
  }

  // Start or get conversation with a user
  async startConversation(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { targetUserId } = req.body;
      if (!targetUserId) {
        return res.status(400).json({ success: false, error: 'targetUserId is required' });
      }

      // Check if users follow each other
      const canChat = await this.followService.canUsersChat(user.userId, targetUserId);
      if (!canChat) {
        return res.status(403).json({
          success: false,
          error: 'Cannot chat with this user. You must follow each other to chat.'
        });
      }

      const conversation = await this.conversationService.getOrCreateConversation(
        user.userId,
        targetUserId
      );

      res.json({ success: true, conversation });
    } catch (error) {
      console.error('Error starting conversation:', error);
      res.status(500).json({ success: false, error: 'Failed to start conversation' });
    }
  }

  // Get conversation details
  async getConversation(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const user = (req as any).user;
      
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      // Fetch conversation (you might want to add a method to fetch single conversation)
      const conversations = await this.conversationService.getUserConversations(user.userId, 100);
      const conversation = conversations.find(c => c.conversationId === conversationId);
      
      if (!conversation) {
        return res.status(404).json({ success: false, error: 'Conversation not found' });
      }

      res.json({ success: true, conversation });
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch conversation' });
    }
  }

  // Delete conversation (soft delete)
  async deleteConversation(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const user = (req as any).user;
      
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      await this.conversationService.deleteConversation(conversationId, user.userId);
      
      res.json({ success: true, message: 'Conversation deleted' });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({ success: false, error: 'Failed to delete conversation' });
    }
  }

  // Get messages in a conversation (with pagination)
  async getMessages(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const before = req.query.before as string;
      
      const messages = await this.messageService.getMessages(conversationId, limit, before);
      
      res.json({ success: true, messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
  }

  // Send message via REST API
  async sendMessage(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const user = (req as any).user;
      
      if (!user?.userId || !user?.username) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { content, messageType, mediaUrl, replyTo } = req.body;
      
      if (!content) {
        return res.status(400).json({ success: false, error: 'content is required' });
      }

      // Create message
      const message = await this.messageService.sendMessage({
        conversationId,
        senderId: user.userId,
        senderUsername: user.username,
        content,
        messageType: messageType || 'TEXT',
        mediaUrl,
        replyTo
      });

      // Update conversation last message
      await this.conversationService.updateLastMessage(conversationId, content, user.userId);

      // Emit via Socket.IO to online users
      const io = getIoInstance();
      io.to(conversationId).emit('new_message', message);
      
      res.json({ success: true, message });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  }

  // Delete/Unsend a message
  async deleteMessage(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const user = (req as any).user;
      
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const result = await this.messageService.deleteMessage(messageId, user.userId);
      
      // Emit deletion event
      const message = await this.messageService.getMessageById(messageId);
      if (message) {
        const io = getIoInstance();
        io.to(message.conversationId).emit('message_deleted', {
          messageId,
          conversationId: message.conversationId
        });
      }
      
      res.json(result);
    } catch (error: any) {
      console.error('Error deleting message:', error);
      res.status(error.message === 'Unauthorized or message not found' ? 403 : 500)
         .json({ success: false, error: error.message || 'Failed to delete message' });
    }
  }

  // Add reaction to message
  async addReaction(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const { emoji } = req.body;
      const user = (req as any).user;
      
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      if (!emoji) {
        return res.status(400).json({ success: false, error: 'emoji is required' });
      }

      const result = await this.messageService.addReaction(messageId, user.userId, emoji);
      
      // Emit reaction event
      const message = await this.messageService.getMessageById(messageId);
      if (message) {
        const io = getIoInstance();
        io.to(message.conversationId).emit('reaction_added', {
          messageId,
          userId: user.userId,
          emoji,
          reactions: result.reactions
        });
      }
      
      res.json(result);
    } catch (error: any) {
      console.error('Error adding reaction:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to add reaction' });
    }
  }

  // Remove reaction from message
  async removeReaction(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const user = (req as any).user;
      
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const result = await this.messageService.removeReaction(messageId, user.userId);
      
      // Emit reaction removal event
      const message = await this.messageService.getMessageById(messageId);
      if (message) {
        const io = getIoInstance();
        io.to(message.conversationId).emit('reaction_removed', {
          messageId,
          userId: user.userId,
          reactions: result.reactions
        });
      }
      
      res.json(result);
    } catch (error: any) {
      console.error('Error removing reaction:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to remove reaction' });
    }
  }

  // Mark conversation as read
  async markAsRead(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const user = (req as any).user;
      
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      await this.conversationService.markAsRead(conversationId, user.userId);
      
      // Notify other participants
      const io = getIoInstance();
      io.to(conversationId).emit('messages_read', {
        conversationId,
        userId: user.userId
      });
      
      res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
      console.error('Error marking as read:', error);
      res.status(500).json({ success: false, error: 'Failed to mark as read' });
    }
  }

  // Get unread count for user
  async getUnreadCount(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const totalUnread = await this.conversationService.getTotalUnreadCount(user.userId);
      
      res.json({ success: true, unreadCount: totalUnread });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch unread count' });
    }
  }

  // Search messages in conversation
  async searchMessages(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 20;
      
      if (!query) {
        return res.status(400).json({ success: false, error: 'Query parameter q is required' });
      }

      const messages = await this.messageService.searchMessages(conversationId, query, limit);
      
      res.json({ success: true, messages });
    } catch (error) {
      console.error('Error searching messages:', error);
      res.status(500).json({ success: false, error: 'Failed to search messages' });
    }
  }

  // Get media from conversation
  async getMediaMessages(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const mediaMessages = await this.messageService.getMediaMessages(conversationId, limit);
      
      res.json({ success: true, messages: mediaMessages });
    } catch (error) {
      console.error('Error fetching media messages:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch media messages' });
    }
  }

  // Get users that can be chatted with (mutual follows)
  async getChatableUsers(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      if (!user?.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const chatableUsers = await this.followService.getChatableUsers(user.userId);
      
      res.json({ 
        success: true, 
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

  // ==================== Legacy Controllers (for backward compatibility) ====================

  // Get chat room history (deprecated)
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

  // Send message via REST API (deprecated)
  async sendMessageLegacy(req: Request, res: Response) {
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

  // Get room users (deprecated)
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
}
