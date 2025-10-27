import { PrismaClient as ChatPrismaClient } from '../../generated/prisma/client-chat/index.js';

const chatPrisma = new ChatPrismaClient();

interface SendMessageData {
  conversationId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  messageType?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';
  mediaUrl?: string;
  replyTo?: string;
}

export class MessageService {
  // Send a message (Instagram style)
  async sendMessage(data: SendMessageData) {
    const message = await chatPrisma.message.create({
      data: {
        conversationId: data.conversationId,
        messageType: data.messageType || 'TEXT',
        senderId: data.senderId,
        senderUsername: data.senderUsername,
        content: data.content,
        mediaUrl: data.mediaUrl,
        status: 'SENT',
        replyTo: data.replyTo
      }
    });

    return message;
  }

  // Get messages for a conversation (with pagination)
  async getMessages(conversationId: string, limit: number = 50, before?: string) {
    const where: any = {
      conversationId,
      isDeleted: false
    };

    if (before) {
      where.createdAt = { lt: new Date(before) };
    }

    const messages = await chatPrisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return messages.reverse(); // Return in chronological order
  }

  // Update message status (SENT -> DELIVERED -> READ)
  async updateMessageStatus(messageId: string, userId: string, status: 'SENT' | 'DELIVERED' | 'READ') {
    await chatPrisma.messageReadStatus.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId
        }
      },
      create: {
        messageId,
        userId,
        status
      },
      update: {
        status,
        timestamp: new Date()
      }
    });

    // Update main message status to highest status
    await chatPrisma.message.update({
      where: { id: messageId },
      data: { status }
    });
  }

  // Delete/Unsend message (Instagram style)
  async deleteMessage(messageId: string, userId: string) {
    const message = await chatPrisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message || message.senderId !== userId) {
      throw new Error('Unauthorized or message not found');
    }

    // Soft delete
    await chatPrisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        content: 'This message was deleted' // Optional: show deleted placeholder
      }
    });

    return { success: true, message: 'Message deleted' };
  }

  // Add reaction to message (Instagram style)
  async addReaction(messageId: string, userId: string, emoji: string) {
    const message = await chatPrisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      throw new Error('Message not found');
    }

    const reactions = (message.reactions as any) || {};
    reactions[userId] = emoji;

    await chatPrisma.message.update({
      where: { id: messageId },
      data: { reactions }
    });

    return { success: true, reactions };
  }

  // Remove reaction from message
  async removeReaction(messageId: string, userId: string) {
    const message = await chatPrisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      throw new Error('Message not found');
    }

    const reactions = (message.reactions as any) || {};
    delete reactions[userId];

    await chatPrisma.message.update({
      where: { id: messageId },
      data: { reactions }
    });

    return { success: true, reactions };
  }

  // Get message by ID
  async getMessageById(messageId: string) {
    return await chatPrisma.message.findUnique({
      where: { id: messageId }
    });
  }

  // Search messages in conversation
  async searchMessages(conversationId: string, query: string, limit: number = 20) {
    return await chatPrisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
        content: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  // Get media messages (images/videos) from conversation
  async getMediaMessages(conversationId: string, limit: number = 20) {
    return await chatPrisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
        messageType: { in: ['IMAGE', 'VIDEO'] }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}
