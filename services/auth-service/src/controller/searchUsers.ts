import prisma from "../config/prismaClient.js";
import type { Request, Response } from "express";

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const userPayload = req.headers["x-user-payload"];

    if (!userPayload) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const currentUser = JSON.parse(userPayload as string);
    const currentUserId = currentUser.id;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    // Search users by username, name or email
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: currentUserId, // Exclude current user
            },
          },
          {
            OR: [
              {
                username: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
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
    const { userId } = req.params;
    const userPayload = req.headers["x-user-payload"];

    if (!userPayload) {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
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

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userPayload = req.headers["x-user-payload"];

    if (!userPayload) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const currentUser = JSON.parse(userPayload as string);
    const { name, bio, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update user profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user profile.",
      error: error.message,
    });
  }
};
