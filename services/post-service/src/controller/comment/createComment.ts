import prisma from "../../config/prismaClient.js";
import { Request, Response } from "express";
import { commentValidation } from "../../types/zodType.js";
import { sendEvent } from "../../utils/Kafka/kafkaProducer.js";

export const createComment = async (req: Request, res: Response) => {
  const userData = req.headers["x-user-payload"];
  if (!userData) {
    return res.status(403).json({
      success: false,
      message: "unAuthorized",
    });
  }
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Add PostId in params",
      });
    }
    const user = JSON.parse(userData as string);
    const userId = user.id;
    const username = user.username;

    if (!userId || !username) {
      return res.status(400).json({
        success: false,
        message: "Invalid user payload",
      });
    }

    const commentdata = commentValidation.safeParse(req.body);
    if (!commentdata.success) {
      return res.status(400).json({
        success: false,
        message: "comment body is not ok",
      });
    }
    const addComment = await prisma.comment.create({
      data: {
        content: commentdata.data.content,
        authorUsername: username,
        postId: postId,
        authorId: userId,
      },
    });

    const postUser = await prisma.post.findFirst({
      where: { id: addComment.postId },
      select: { authorId: true },
    });
    if (!addComment|| !postUser ) {
      return res.status(400).json({
        success: false,
        message: "comment not created",
      });
    }
    const eventProduce = await sendEvent("POST_TOPIC", "comment.created", {
      commentId: addComment.id,
      authorId: addComment.authorId, // commenter’s ID
      recipientId: postUser, // post owner’s ID
      authorUsername: addComment.authorUsername, // commenter username
      postId: addComment.postId,
      createdAt: addComment.createdAt,
    });
    console.log("event send successfully", eventProduce);

    if (!eventProduce) {
      return res.status(400).json({
        success: false,
        message: "event produce error",
      });
    }

    return res.status(200).json({
      success: true,
      data: addComment,
      author: {
        id: addComment.authorId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal error from create comment",
    });
  }
};
