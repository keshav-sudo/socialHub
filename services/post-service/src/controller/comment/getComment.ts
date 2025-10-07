import prisma from "../../config/prismaClient.js";
import { Request, Response } from "express";

export const getComments = async (req: Request,res: Response) => {
  const userData = req.headers["x-user-payload"];
  if (!userData) {
    return res.status(403).json({
      success: false,
      message: "Authentication payload missing in header.",
    });
  }

  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required in URL parameters.",
      });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!comments || comments.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No comments found for this post.",
      });
    }

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while fetching comments.",
    });
  }
};
