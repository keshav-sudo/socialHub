import prisma from "../config/prismaClient.js";
import { Request, Response } from "express";

export const getUserNotifications = async (req: Request, res: Response) => {
  const userPayload = req.headers["x-user-payload"];
  if (!userPayload) {
    return res.status(403).json({
      success: false,
      message: "Authentication payload missing in header.",
    });
  }
  try {
    const user = JSON.parse(userPayload as string);
    const userId = user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "problem while fetching userId",
      });
    }

    const [unreadNotifications, updateResult] = await prisma.$transaction([
      prisma.notifications.findMany({
        where: { userId: userId, is_read: false },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.notifications.updateMany({
        where: { userId: userId, is_read: false },
        data: { is_read: true },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: `Fetched and marked ${updateResult.count} notifications as read.`,
      data: unreadNotifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
