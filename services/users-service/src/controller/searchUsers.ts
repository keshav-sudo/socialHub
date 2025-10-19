import prisma from "../config/prismaClient.js";
import type { Request, Response } from "express";

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const UserPayload = req.headers["x-user-payload"];

    if (!UserPayload) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const currentUser = JSON.parse(UserPayload as string);
    const currentUserId = currentUser.id;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    // Search users by username
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
        id: {
          not: currentUserId, // Exclude current user
        },
      },
      select: {
        id: true,
        username: true,
      },
      take: 20,
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error: any) {
    console.error("Search users error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search users.",
      error: error.message,
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const UserPayload = req.headers["x-user-payload"];

    if (!UserPayload) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const currentUser = JSON.parse(UserPayload as string);
    const currentUserId = currentUser.id as string;

    // Get user profile with follow status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if current user follows this user
    const followRecord = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
      select: {
        isActive: true,
      },
    });

    const isFollowing = followRecord?.isActive || false;

    // Get follower/following counts
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({
        where: {
          followingId: userId,
          isActive: true,
        },
      }),
      prisma.follow.count({
        where: {
          followerId: userId,
          isActive: true,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        isFollowing,
        followersCount,
        followingCount,
      },
    });
  } catch (error: any) {
    console.error("Get user profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user profile.",
      error: error.message,
    });
  }
};
