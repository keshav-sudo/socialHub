import { Request, Response } from "express";
import prisma from "../config/prismaClient.js";

export const deletePost = async (req: Request, res: Response) => {
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
        message: "Add PostId in params",
      });
    }

    const user = JSON.parse(userData as string);
    const userId = user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user payload",
      });
    }

    const deletedPost = await prisma.post.updateMany({
      where: {
        authorId: userId,
        id: postId,
        isActive: true,
        isDeleted: false,
      },
      data: {
        isActive: false,
        isDeleted: true,
      },
    });

    if (deletedPost.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error ,
    });
  }
};
