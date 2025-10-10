import prisma from "../config/prismaClient.js";

interface PostCreated {
  postId: string;
  authorId: string;
  username: string;
}

interface CommentCreated {
  commentId: string;
  postId: string;
  authorId: string; // person who made the comment
  recipientId: string; // owner of the post
  authorUsername: string;
  createdAt: Date;
}

interface FollowCreated {
  followingId: string; // person being followed (recipient)
  authorId: string; // follower
}

interface LikeCreated {
  likeId: string;
  postId: string;
  authorId: string; // liker
  recipientId: string; // post owner
}

export const handlePostcreated = async ({
  postId,
  authorId,
  username,
}: PostCreated): Promise<boolean> => {
  try {
    if (!postId || !authorId || !username) {
      console.error("❌ Missing required fields in post.created event.");
      return false;
    }

    await prisma.notifications.create({
      data: {
        userId: authorId,
        triggeredById: authorId,
        username,
        type: "POST",
        message: "You created a new post!",
        link: `/posts/${postId}`,
        is_read: false,
      },
    });

    return true;
  } catch (error) {
    console.error("❌ Notification creation error:", error);
    return false;
  }
};

export const handleCommentCreate = async ({
  commentId,
  postId,
  authorId,
  recipientId,
  authorUsername,
  createdAt,
}: CommentCreated): Promise<boolean> => {
  try {
    if (!recipientId || !authorId || !postId || !commentId) {
      console.error("❌ Missing required fields in comment.created event.");
      return false;
    }

    await prisma.notifications.create({
      data: {
        commentId,
        postId,
        userId: recipientId,
        triggeredById: authorId,
        username: authorUsername,
        type: "ENGAGEMENT",
        message: "New comment on your post!",
        createdAt,
      },
    });

    return true;
  } catch (error) {
    console.error("❌ Notification creation error:", error);
    return false;
  }
};

export const handleFollowCreate = async ({
  followingId,
  authorId,
}: FollowCreated): Promise<boolean> => {
  try {
    if (!followingId || !authorId) {
      console.error("❌ Missing required fields in follow.created event.");
      return false;
    }

    await prisma.notifications.create({
      data: {
        userId: followingId,
        triggeredById: authorId,
        type: "ENGAGEMENT",
        message: "You have a new follower!",
      },
    });

    return true;
  } catch (error) {
    console.error("❌ Notification creation error:", error);
    return false;
  }
};

export const handleLikecreate = async ({
  postId,
  likeId,
  authorId,
  recipientId,
}: LikeCreated): Promise<boolean> => {
  try {
    if (!recipientId || !postId || !likeId || !authorId) {
      console.error("❌ Missing required fields in like.created event.");
      return false;
    }

    await prisma.notifications.create({
      data: {
        postId,
        likeId,
        userId: recipientId,
        triggeredById: authorId,
        type: "ENGAGEMENT",
        message: "Someone liked your post!",
      },
    });

    return true;
  } catch (error) {
    console.error("❌ Notification creation error:", error);
    return false;
  }
};

export default {
  handlePostcreated,
  handleCommentCreate,
  handleFollowCreate,
  handleLikecreate,
};
