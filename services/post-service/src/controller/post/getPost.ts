import prisma from "../../config/prismaClient.js";
import { Request, Response } from "express";

export const getPost = async (req: Request,res: Response) => {
  try {
    const userDetails = req.headers["x-user-payload"];
    console.log("User Details from Header:", userDetails);
    if (!userDetails) {
      return res.status(403).json({
        success: false,
        message: "Authentication payload missing in header.",
      });
    }
    const user = JSON.parse(userDetails as string);
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication payload format.",
      });
    }

    const userId: string = user.id;
    const postId: string = req.params.id as string;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "postId in not ok",
      });
    }
    const findPost = await prisma.post.findFirst({
      where: {
        authorId: userId,
        id: postId,
      },
      select: {
        id: true,
        content: true,
        caption: true,
        imageUrls: true,
        aiContent: true,
        aicaption: true,
        authorId: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    if (!findPost) {
      return res.status(400).json({
        success: false,
        message: "post is not defined",
      });
    }
    return res.status(200).json({
      success: true,
      data: findPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "post not fetched",
    });
  }
};
