import prisma from "../config/prismaClient.js";
import type { Request, Response } from "express";
import { sendEvent } from "../utils/Kafka.js";
export const followUser = async (req: Request, res: Response) => {
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

    const targetId  = req.params.id as string;
    if (userId === targetId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    await prisma.user.upsert({
      where: { id: targetId },
      update: {},
      create: { id: targetId },
    });
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId : userId,
          followingId : targetId
        },
        isActive : false,
        isDeleted : true
      }
    })
    if(existingFollow){
      const follow = await prisma.follow.update({
        where : {id : existingFollow.id},
        data: { isActive: true, isDeleted: false },
      })
      return res.status(200).json({
        success : true,
        message : "User following Again",
        data : follow
      })
    }

    const follow = await prisma.follow.create({
        data : {
            followerId : userId,
            followingId : targetId
        }
    });
    if(!follow){
        return res.status(400).json({
            success : false, 
            message : "unable to follow"
        })
    }
    const event = await sendEvent("USER_TOPIC" , "follow.created" , {
      user_id : userId,
      following_id : targetId
    })
    if(!event){
      return res.status(400).json({
        success : false,
        messgae : "error while following"
      })
    }
    console.log("followed SuccessFully ",!event);

    return res.status(200).json({
        success : true,
        message : "successfully followed",
        data : follow
    })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "error in follow controller"
    }) 
  }
};
