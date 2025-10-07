import prisma from "../../config/prismaClient.js";
import { Request, Response } from "express";
import { commentValidation } from "../../types/zodType.js";

export const updateComment = async (req: Request,res: Response) => {
  const userData = req.headers["x-user-payload"];
  if (!userData) {
    return res.status(403).json({
      success: false,
      message: "unAuthorized",
    });
  }
  try {
    const commentId = req.params.id;
    if (!commentId) {
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
    const commentdata = commentValidation.safeParse(req.body);
    if (!commentdata.success) {
      return res.status(400).json({
        success: false,
        message: "comment body is not ok",
      });
    }
    const addComment = await prisma.comment.update({
      where: {
        id: commentId,
        authorId: userId,
        isActive: true,
        isDelete: false,
      },
      data: {
        content: commentdata.data.content,
      },
    });
    if (!addComment) {
      return res.status(400).json({
        success: false,
        message: "comment not updated",
      });
    }

    return res.status(200).json({
      success: true,
      data: addComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal error from update comment",
    });
  }
};
