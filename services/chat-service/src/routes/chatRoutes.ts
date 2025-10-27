import { Router, Request, Response, NextFunction } from 'express';
import { ChatController } from '../controller/chatController.js';

const router = Router();
const chatController = new ChatController();

// Middleware to extract user from nginx x-user-payload header
const extractUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userPayloadHeader = req.headers['x-user-payload'] as string;
    
    if (userPayloadHeader) {
      const userPayload = JSON.parse(userPayloadHeader);
      (req as any).user = {
        userId: userPayload.id || userPayload.userId,
        username: userPayload.username
      };
    }
    
    next();
  } catch (error) {
    console.error('Error parsing user payload:', error);
    next();
  }
};

// Apply user extraction to all routes
router.use(extractUser);


// Get all conversations for user
router.get('/conversations', chatController.getConversations.bind(chatController));

// Start or get conversation with a user
router.post('/conversations/start', chatController.startConversation.bind(chatController));

// Get conversation details
router.get('/conversations/:conversationId', chatController.getConversation.bind(chatController));

// Delete conversation (soft delete)
router.delete('/conversations/:conversationId', chatController.deleteConversation.bind(chatController));

// Get messages in a conversation (with pagination)
router.get('/conversations/:conversationId/messages', chatController.getMessages.bind(chatController));

// Send message via REST API
router.post('/conversations/:conversationId/messages', chatController.sendMessage.bind(chatController));

// Delete/Unsend a message
router.delete('/messages/:messageId', chatController.deleteMessage.bind(chatController));

// Add reaction to message
router.post('/messages/:messageId/reactions', chatController.addReaction.bind(chatController));

// Remove reaction from message
router.delete('/messages/:messageId/reactions', chatController.removeReaction.bind(chatController));

// Mark conversation as read
router.post('/conversations/:conversationId/read', chatController.markAsRead.bind(chatController));

// Get unread count for user
router.get('/unread-count', chatController.getUnreadCount.bind(chatController));

// Search messages in conversation
router.get('/conversations/:conversationId/search', chatController.searchMessages.bind(chatController));

// Get media from conversation
router.get('/conversations/:conversationId/media', chatController.getMediaMessages.bind(chatController));

// Get users that can be chatted with (mutual follows)
router.get('/chatable-users', chatController.getChatableUsers.bind(chatController));

// Get socket info (for debugging)
router.get('/socket-info', chatController.getSocketInfo.bind(chatController));

// ==================== Legacy Routes (for backward compatibility) ====================

// Get chat room history (deprecated - use /conversations/:conversationId/messages)
router.get('/:roomId/history', chatController.getHistory.bind(chatController));

// Send message via REST API (deprecated - use /conversations/:conversationId/messages)
router.post('/:roomId/message', chatController.sendMessageLegacy.bind(chatController));

// Get room users (deprecated)
router.get('/:roomId/users', chatController.getRoomUsers.bind(chatController));

export default router;
