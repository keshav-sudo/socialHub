import prisma from "../config/prismaClient.js";
import type { Request, Response } from "express";
import { sendEvent } from "../utils/Kafka.js";

export const unFollow = async (req: Request, res: Response) => {
  try {
    const UserPayload = req.headers["x-user-payload"];
    const User = JSON.parse(UserPayload as string);
    const userId = User.id;
    if (!UserPayload || !User || !userId) {
      return res.status(400).json({
        success: false,
        message: "Error in User Payload",
      });
    }

    const targetId = req.params.id as string;
    if (userId === targetId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }
    const result = await prisma.follow.updateMany({
      where: {
        followerId: userId,
        followingId: targetId,
        isActive: true,
        isDeleted: false,
      },
      data: {
        isActive: false,
        isDeleted: true,
      },
    });
    if(!result){
        return res.status(400).json({
            success : false,
            message : "error while unfollowing"
        })
    }

    const event = await sendEvent("USER_TOPIC" , "unfollow.created" , {
      user_id : userId,
      following_id : targetId
    })
    if(!event){
      return res.status(400).json({
        success : false,
        messgae : "error while following"
      })
    }
    console.log("Unfollowed SuccessFully" , event);

    return res.status(200).json({
      success : true,
      message : "successFully unfollowed",
      data : event.valueOf()
    })

  } catch (error) {
    return res.status(500).json({
        success : false,
        message : "error in Follow Controller"
    })
  }
};
