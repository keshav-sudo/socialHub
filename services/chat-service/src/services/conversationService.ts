import { PrismaClient as ChatPrismaClient } from '../../generated/prisma/client-chat/index.js';

const chatPrisma = new ChatPrismaClient();

export class ConversationService {
  // Create or get conversation between two users (Instagram DM style)
  async getOrCreateConversation(userId1: string, userId2: string) {
    // Create consistent conversation ID (sorted user IDs)
    const conversationId = [userId1, userId2].sort().join('_');
    
    let conversation = await chatPrisma.conversation.findUnique({
      where: { conversationId }
    });

    if (!conversation) {
      conversation = await chatPrisma.conversation.create({
        data: {
          conversationId,
          chatType: 'SINGLE',
          participants: [userId1, userId2].sort(),
        }
      });

      // Initialize unread count for both users
      await chatPrisma.unreadCount.createMany({
        data: [
          { conversationId, userId: userId1, count: 0 },
          { conversationId, userId: userId2, count: 0 }
        ]
      });
    }

    return conversation;
  }

  // Get all conversations for a user (Instagram conversation list)
  async getUserConversations(userId: string, limit: number = 50) {
    const conversations = await chatPrisma.conversation.findMany({
      where: {
        participants: {
          has: userId
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      },
      take: limit
    });

    // Get unread counts for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await chatPrisma.unreadCount.findUnique({
          where: {
            conversationId_userId: {
              conversationId: conv.conversationId,
              userId
            }
          }
        });

        return {
          ...conv,
          unreadCount: unreadCount?.count || 0
        };
      })
    );

    return conversationsWithUnread;
  }

  // Update conversation's last message
  async updateLastMessage(conversationId: string, message: string, senderId: string) {
    return await chatPrisma.conversation.update({
      where: { conversationId },
      data: {
        lastMessage: message,
        lastMessageBy: senderId,
        lastMessageAt: new Date()
      }
    });
  }

  // Increment unread count for recipient
  async incrementUnreadCount(conversationId: string, recipientId: string) {
    const unread = await chatPrisma.unreadCount.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: recipientId
        }
      }
    });

    if (unread) {
      await chatPrisma.unreadCount.update({
        where: {
          conversationId_userId: {
            conversationId,
            userId: recipientId
          }
        },
        data: {
          count: { increment: 1 }
        }
      });
    }
  }

  // Mark conversation as read (Reset unread count)
  async markAsRead(conversationId: string, userId: string) {
    await chatPrisma.unreadCount.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId
        }
      },
      data: {
        count: 0,
        lastReadAt: new Date()
      }
    });

    // Update message statuses to READ
    const messages = await chatPrisma.message.findMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isDeleted: false
      }
    });

    // Update status for all messages in this conversation
    for (const msg of messages) {
      await chatPrisma.messageReadStatus.upsert({
        where: {
          messageId_userId: {
            messageId: msg.id,
            userId
          }
        },
        create: {
          messageId: msg.id,
          userId,
          status: 'READ'
        },
        update: {
          status: 'READ',
          timestamp: new Date()
        }
      });
    }
  }

  // Get unread count for a user across all conversations
  async getTotalUnreadCount(userId: string) {
    const unreadCounts = await chatPrisma.unreadCount.findMany({
      where: { userId }
    });

    return unreadCounts.reduce((sum, item) => sum + item.count, 0);
  }

  // Delete conversation for user (Instagram style - only hides)
  async deleteConversation(conversationId: string, userId: string) {
    // In Instagram style, we just mark messages as deleted for this user
    // The conversation still exists for other participants
    await chatPrisma.message.updateMany({
      where: { conversationId },
      data: { isDeleted: true, deletedAt: new Date() }
    });

    // Reset unread count
    await this.markAsRead(conversationId, userId);
  }
}
