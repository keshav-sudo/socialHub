import prisma from "../../config/prismaClient.js";
import { Request, Response } from "express";

export const deleteComment = async (req: Request,res: Response) => {
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

    const findComment = await prisma.comment.findFirst({
      where : {
        id: commentId,
        authorId: userId,
        isActive: false,
        isDelete: true,
      }
    })
    if(findComment){
      return res.status(200).json({
        success : true,
        messgae : "already deleted"
      })
    }
    const deleteComment = await prisma.comment.update({
      where: {
        id: commentId,
        authorId: userId,
        isActive: true,
        isDelete: false,
      },
      data: {
        isActive: false,
        isDelete: true,
      },
    });
    if (!deleteComment) {
      return res.status(400).json({
        success: false,
        message: "comment not delete",
      });
    }

    return res.status(200).json({
      success: true,
      data: deleteComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal error from delete comment",
    });
  }
};
