import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatService } from '../services/chatService.js';
import { FollowService } from '../services/followService.js';
import { ConversationService } from '../services/conversationService.js';
import { MessageService } from '../services/messageService.js';

let ioInstance: SocketIOServer;

export function getIoInstance(): SocketIOServer {
  if (!ioInstance) {
    throw new Error('Socket.IO instance not initialized');
  }
  return ioInstance;
}

export function setupSocketHandlers(io: SocketIOServer) {
  ioInstance = io;
  const chatService = new ChatService(io);
  const followService = new FollowService();
  const conversationService = new ConversationService();
  const messageService = new MessageService();

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id, 'User:', socket.data.userId);

    // Join user's personal room for receiving notifications
    socket.join(`user:${socket.data.userId}`);

    // Instagram-style: Start conversation with a user
    socket.on('start_conversation', async (data: { targetUserId: string }) => {
      if (!socket.data.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      try {
        // Check if users follow each other
        const canChat = await followService.canUsersChat(socket.data.userId, data.targetUserId);
        if (!canChat) {
          socket.emit('error', { 
            message: 'Cannot chat with this user. You must follow each other to chat.' 
          });
          return;
        }

        // Get or create conversation
        const conversation = await conversationService.getOrCreateConversation(
          socket.data.userId, 
          data.targetUserId
        );

        // Join conversation room
        socket.join(conversation.conversationId);

        // Send conversation details and message history
        const messages = await messageService.getMessages(conversation.conversationId, 50);
        
        socket.emit('conversation_started', {
          conversation,
          messages
        });

        // Mark as read
        await conversationService.markAsRead(conversation.conversationId, socket.data.userId);

      } catch (error) {
        console.error('Error starting conversation:', error);
        socket.emit('error', { message: 'Failed to start conversation' });
      }
    });

    // Join a conversation
    socket.on('join_conversation', async (data: { conversationId: string }) => {
      if (!socket.data.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      try {
        socket.join(data.conversationId);
        
        // Get message history
        const messages = await messageService.getMessages(data.conversationId, 50);
        socket.emit('message_history', messages);
        
        // Mark as read
        await conversationService.markAsRead(data.conversationId, socket.data.userId);

        // Notify other users in conversation that this user is online
        socket.to(data.conversationId).emit('user_online', {
          userId: socket.data.userId,
          username: socket.data.username
        });

      } catch (error) {
        console.error('Error joining conversation:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Send a message (Instagram style)
    socket.on('send_message', async (data: { 
      conversationId: string; 
      content: string;
      messageType?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';
      mediaUrl?: string;
      replyTo?: string;
    }) => {
      if (!socket.data.userId || !socket.data.username) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      try {
        // Create message in database
        const message = await messageService.sendMessage({
          conversationId: data.conversationId,
          senderId: socket.data.userId,
          senderUsername: socket.data.username,
          content: data.content,
          messageType: data.messageType || 'TEXT',
          mediaUrl: data.mediaUrl,
          replyTo: data.replyTo
        });

        // Update conversation last message
        await conversationService.updateLastMessage(
          data.conversationId, 
          data.content, 
          socket.data.userId
        );

        // Get conversation participants
        const conversation = await conversationService.getOrCreateConversation(
          socket.data.userId,
          socket.data.userId // Will fetch existing conversation
        );

        // Increment unread count for recipients
        const recipients = conversation.participants.filter(p => p !== socket.data.userId);
        for (const recipientId of recipients) {
          await conversationService.incrementUnreadCount(data.conversationId, recipientId);
          
          // Notify recipient (if online)
          io.to(`user:${recipientId}`).emit('new_message_notification', {
            conversationId: data.conversationId,
            message,
            unreadCount: await conversationService.getTotalUnreadCount(recipientId)
          });
        }

        // Broadcast message to conversation room
        io.to(data.conversationId).emit('new_message', message);

        // Send delivery confirmation to sender
        socket.emit('message_sent', { 
          tempId: data.replyTo, // For client-side temporary message tracking
          message 
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Mark messages as delivered
    socket.on('message_delivered', async (data: { messageId: string }) => {
      if (!socket.data.userId) return;

      try {
        await messageService.updateMessageStatus(data.messageId, socket.data.userId, 'DELIVERED');
        
        // Notify sender
        const message = await messageService.getMessageById(data.messageId);
        if (message) {
          io.to(`user:${message.senderId}`).emit('message_status_update', {
            messageId: data.messageId,
            status: 'DELIVERED'
          });
        }
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    });

    // Mark messages as read
    socket.on('mark_as_read', async (data: { conversationId: string }) => {
      if (!socket.data.userId) return;

      try {
        await conversationService.markAsRead(data.conversationId, socket.data.userId);
        
        // Notify other participants
        socket.to(data.conversationId).emit('messages_read', {
          conversationId: data.conversationId,
          userId: socket.data.userId
        });
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    });

    // Delete/Unsend message
    socket.on('delete_message', async (data: { messageId: string; conversationId: string }) => {
      if (!socket.data.userId) return;

      try {
        await messageService.deleteMessage(data.messageId, socket.data.userId);
        
        // Notify all participants
        io.to(data.conversationId).emit('message_deleted', {
          messageId: data.messageId,
          conversationId: data.conversationId
        });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Add reaction to message
    socket.on('add_reaction', async (data: { 
      messageId: string; 
      conversationId: string; 
      emoji: string 
    }) => {
      if (!socket.data.userId) return;

      try {
        const result = await messageService.addReaction(
          data.messageId, 
          socket.data.userId, 
          data.emoji
        );
        
        // Notify all participants
        io.to(data.conversationId).emit('reaction_added', {
          messageId: data.messageId,
          userId: socket.data.userId,
          emoji: data.emoji,
          reactions: result.reactions
        });
      } catch (error) {
        console.error('Error adding reaction:', error);
      }
    });

    // Remove reaction
    socket.on('remove_reaction', async (data: { 
      messageId: string; 
      conversationId: string 
    }) => {
      if (!socket.data.userId) return;

      try {
        const result = await messageService.removeReaction(data.messageId, socket.data.userId);
        
        // Notify all participants
        io.to(data.conversationId).emit('reaction_removed', {
          messageId: data.messageId,
          userId: socket.data.userId,
          reactions: result.reactions
        });
      } catch (error) {
        console.error('Error removing reaction:', error);
      }
    });

    // Handle typing indicator
    socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
      if (!socket.data.userId) return;
      
      socket.to(data.conversationId).emit('user_typing', {
        userId: socket.data.userId,
        username: socket.data.username,
        conversationId: data.conversationId,
        isTyping: data.isTyping,
      });
    });

    // Get conversation list (Instagram inbox)
    socket.on('get_conversations', async () => {
      if (!socket.data.userId) return;

      try {
        const conversations = await conversationService.getUserConversations(socket.data.userId);
        socket.emit('conversations_list', conversations);
      } catch (error) {
        console.error('Error getting conversations:', error);
        socket.emit('error', { message: 'Failed to load conversations' });
      }
    });

    // Load more messages (pagination)
    socket.on('load_more_messages', async (data: { 
      conversationId: string; 
      before: string; 
      limit?: number 
    }) => {
      if (!socket.data.userId) return;

      try {
        const messages = await messageService.getMessages(
          data.conversationId, 
          data.limit || 50, 
          data.before
        );
        socket.emit('messages_loaded', messages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', socket.id, 'Reason:', reason);
      
      // Notify conversations that user went offline
      // (In production, you might want to track this more carefully)
    });
  });

  return chatService;
}
