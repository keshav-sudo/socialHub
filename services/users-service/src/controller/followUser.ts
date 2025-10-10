import prisma from "../config/prismaClient.js";
import type { Request, Response } from "express";
import { sendEvent } from "../utils/Kafka.js";

export const followUser = async (req: Request, res: Response) => {
  try {
    const UserPayload = req.headers["x-user-payload"];
    const User = JSON.parse(UserPayload as string);
    const userId = User.id;
    const username = User.username;

    if (!UserPayload || !User || !userId || !username) {
      return res.status(400).json({
        success: false,
        message: "Error in User Payload",
      });
    }

    const targetId = req.params.id as string;
    if (userId === targetId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }


    const existingActiveFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
        isActive: true,
      },
    });

    if (existingActiveFollow) {
      return res.status(200).json({
        success: true,
        message: "You are already following this user.",
        data: existingActiveFollow,
      });
    }

    const follow = await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
      },
      update: {
        isActive: true, 
        isDeleted: false,
      },
      create: {
        followerId: userId,
        followingId: targetId,
      },
    });


    const event = await sendEvent("USER_TOPIC", "follow.created", {
      authorId: userId,
      followingId: targetId,
    });
    
    if (!event) {
        console.error("Warning: Follow successful, but Kafka event failed to send.");
    }
    
    console.log("Followed successfully and event sent.");
    

    return res.status(200).json({
      success: true,
      message: "Successfully followed",
      data: follow,
    });
  } catch (error) {
    // A more descriptive error log for debugging
    console.error("Error in follow controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error in follow controller",
    });
  }
};