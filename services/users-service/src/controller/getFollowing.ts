import prisma from "../config/prismaClient.js";
import type { Request, Response } from "express";

export const getFollowingList = async (req: Request, res: Response) => {
  try {
    const UserPayload = req.headers["x-user-payload"];

    if (!UserPayload) {
      return res.status(401).json({
        success: false,
        message: "Authentication payload missing",
      });
    }
    let User;
    try {
      User = JSON.parse(UserPayload as string);
    } catch (error) {
       return res.status(401).json({
        success: false,
        message: "Invalid User Payload format",
      });
    }
    const userId = User?.id; 
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in payload",
      });
    }

    const followingRecords = await prisma.follow.findMany({
        where: {
            followerId : userId,
            isActive : true,
            isDeleted : false
        }
    })

    return res.status(200).json({
        success : true,
        message : "Fetching 'following' list completed",
        data : followingRecords
    })
} catch(error) {
    return res.status(500).json({
        success : false,
        message : "Fetching 'following' list failed due to an internal server error",
        data : []
    })
}}


export const getFollowersList = async (req: Request, res: Response) => {
  try {
    const UserPayload = req.headers["x-user-payload"];
    if (!UserPayload) {
      return res.status(401).json({
        success: false,
        message: "Authentication payload missing",
      });
    }
    
    let User;
    try {
      User = JSON.parse(UserPayload as string);
    } catch (error) {
       return res.status(401).json({
        success: false,
        message: "Invalid User Payload format",
      });
    }

    const userId = User?.id; 
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in payload",
      });
    }

    const followerRecords = await prisma.follow.findMany({
        where: {
            followingId : userId, 
            isActive : true,
            isDeleted : false
        }
    })
    
    return res.status(200).json({
        success : true,
        message : "Fetching 'followers' list completed",
        data : followerRecords
    })
} catch(error) {
    return res.status(500).json({
        success : false,
        message : "Fetching 'followers' list failed due to an internal server error",
        data : []
    })
}}

export const getFollowCounts = async (req: Request, res: Response) => {
  try {
    const UserPayload = req.headers["x-user-payload"];

    if (!UserPayload) {
      return res.status(401).json({
        success: false,
        message: "Authentication payload missing",
      });
    }

    let User;
    try {
      User = JSON.parse(UserPayload as string);
    } catch (error) {
       return res.status(401).json({
        success: false,
        message: "Invalid User Payload format",
      });
    }

    const userId = User?.id; 
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in payload",
      });
    }

    const followersCount = await prisma.follow.count({
        where: {
            followingId: userId,
            isActive: true,
            isDeleted: false
        }
    });

    const followingCount = await prisma.follow.count({
        where: {
            followerId: userId,
            isActive: true,
            isDeleted: false
        }
    });
    return res.status(200).json({
        success: true,
        message: "Follow/Follower counts fetched successfully",
        data: {
            followers: followersCount,
            following: followingCount
        }
    });
} catch(error) {
    return res.status(500).json({
        success: false,
        message: "Failed to fetch follow counts due to an internal server error",
        data: {
            followers: 0,
            following: 0
        }
    });
}}