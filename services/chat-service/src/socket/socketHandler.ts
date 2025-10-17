import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatService } from '../services/chatService.js';
import { FollowService } from '../services/followService.js';

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

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id, 'User:', socket.data.userId);

    // Join a chat room
    socket.on('join_room', async (data: { roomId: string; targetUserId?: string }) => {
      if (!socket.data.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      try {
        // Check if users follow each other for one-to-one chat
        if (data.targetUserId) {
          const canChat = await followService.canUsersChat(socket.data.userId, data.targetUserId);
          if (!canChat) {
            socket.emit('error', { 
              message: 'Cannot chat with this user. You must follow each other to chat.' 
            });
            return;
          }
        }

        await chatService.joinRoom(socket, data.roomId, socket.data.userId);
        
        // Send message history
        const history = await chatService.getMessageHistory(data.roomId);
        socket.emit('message_history', history);
        
        // Send current room users
        const users = await chatService.getRoomUsers(data.roomId);
        socket.emit('room_users', users);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave a chat room
    socket.on('leave_room', async (data: { roomId: string }) => {
      if (!socket.data.userId) return;

      try {
        await chatService.leaveRoom(socket, data.roomId, socket.data.userId);
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    // Send a message
    socket.on('send_message', async (data: { roomId: string; message: string; targetUserId?: string }) => {
      if (!socket.data.userId || !socket.data.username) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      try {
        // Check if users follow each other for one-to-one chat
        if (data.targetUserId) {
          const canChat = await followService.canUsersChat(socket.data.userId, data.targetUserId);
          if (!canChat) {
            socket.emit('error', { 
              message: 'Cannot send message. You must follow each other to chat.' 
            });
            return;
          }
        }

        await chatService.sendMessage({
          roomId: data.roomId,
          userId: socket.data.userId,
          username: socket.data.username,
          message: data.message,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data: { roomId: string; isTyping: boolean }) => {
      if (!socket.data.userId) return;
      
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.data.userId,
        username: socket.data.username,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', socket.id, 'Reason:', reason);
    });
  });

  return chatService;
}
