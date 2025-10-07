import prisma from "../../config/prismaClient.js";
import { Request, Response } from "express";

export const createDisLike = async (req: Request,res: Response) => {
  const userData = req.headers["x-user-payload"];
  if (!userData) {
    return res.status(403).json({
      success: false,
      message: "Authentication payload missing in header.",
    });
  }
  try {
    const user = JSON.parse(userData as string);
    const userId = user.id;
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Authentication payload missing in header.",
      });
    }
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "params id not valid.",
      });
    }
    const disLike = await prisma.like.updateMany({
        where:{
            userId : userId,
            postId : postId,
            isActive : true,
            isDeleted : false
        },
       data: {
        isActive: false,
        isDeleted: true,
      },
    });
    if (!disLike) {
      return res.status(400).json({
        success: false,
        message: "like not maked.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "dislike completed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in dislike controller",
    });
  }
};
