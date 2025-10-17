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

// Get chat room history
router.get('/:roomId/history', chatController.getHistory.bind(chatController));

// Send message via REST API
router.post('/:roomId/message', chatController.sendMessage.bind(chatController));

// Get room users
router.get('/:roomId/users', chatController.getRoomUsers.bind(chatController));

// Get users that can be chatted with (mutual follows)
router.get('/chatable-users/:userId', chatController.getChatableUsers.bind(chatController));

// Get socket info (for debugging)
router.get('/socket-info', chatController.getSocketInfo.bind(chatController));

export default router;
