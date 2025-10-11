import prisma from "../config/prismaClient.js";
import type { Request, Response } from "express";
import { sendEvent } from "../utils/Kafka.js";

export const followUser = async (req: Request, res: Response) => {
  try {
    const UserPayload = req.headers["x-user-payload"];

    if (!UserPayload) {
      return res.status(401).json({
        success: false,
        message: "Authentication payload missing.",
      });
    }

    const User = JSON.parse(UserPayload as string);
    const userId = User.id;
    const username = User.username;

    // Check 1: Basic Payload Data Validation
    if (!userId || !username) {
      return res.status(400).json({
        success: false,
        message: "Invalid or incomplete authentication payload.",
      });
    }

    const targetId = req.params.id as string;

    if (!targetId) {
      return res.status(400).json({
        success: false,
        message: "Target user ID missing in parameters.",
      });
    }

    if (userId === targetId) {
        return res.status(400).json({
            success: false,
            message: "You cannot follow yourself.",
        });
    }

    // ⭐ STEP 1: ENSURE FOLLOWER (userId) EXISTS (Just-in-Time Creation)
    // Always upsert the follower to ensure local existence and updated username.
    await prisma.user.upsert({
        where: { id: userId },
        update: { username: username }, 
        create: {
            id: userId,
            username: username,
        },
    });

    // ⭐ STEP 2: ENSURE TARGET USER (targetId) EXISTS (Just-in-Time Creation)
    // Agar target user exist nahi karta, toh use default properties ke saath create karo.
    // NOTE: Yahan 'username' null rahega agar woh pehle se exist nahi karta tha.
    const targetUserRecord = await prisma.user.upsert({
        where: { id: targetId },
        update: {}, // Agar user exist karta hai, toh kuch update mat karo.
        create: {
            id: targetId,
            username: null, // Ya koi placeholder username
        },
        select: { username: true } // Target ka username nikaal lo event ke liye
    });


    // Check 3: Check for Existing Active Follow (Idempotency)
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

    // Step 4: Create or Reactivate Follow Record
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

    // Step 5: Send Kafka Event (Non-blocking)
    const event = await sendEvent("USER_TOPIC", "follow.created", {
      authorId: userId,
      followingId: targetId,
      newfollower: username,
      // Target user ka username event mein bhejte hain, agar available ho toh
      followedUsername: targetUserRecord.username || 'unknown', 
    });

    if (!event) {
      console.error(
        `❌ Warning: Follow successful, but Kafka event failed to send for ${userId} -> ${targetId}.`
      );
    } else {
        console.log(`✅ Followed successfully and event sent for ${userId} -> ${targetId}.`);
    }

    return res.status(200).json({
      success: true,
      message: "Successfully followed",
      data: follow,
    });

  } catch (error) {
    console.error("Error in follow controller:", error);
    
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while processing the follow request.",
    });
  }
};