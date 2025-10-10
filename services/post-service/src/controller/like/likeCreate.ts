import prisma from "../../config/prismaClient.js";
import { sendEvent } from "../../utils/Kafka/kafkaProducer.js";
import { Request, Response } from "express";

type LikeEventType = "like.created" | "like.reactivated" | "like.already_active";

export const createLike = async (req: Request, res: Response) => {
  const userData = req.headers["x-user-payload"];
  
  if (!userData) {
    return res.status(401).json({
      success: false,
      message: "Authentication is required.",
    });
  }

  try {
    const user = JSON.parse(userData as string);
    const userId = user.id;
    const username = user.username;
    if (!userId || !username) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication payload.",
      });
    }

    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID missing in parameters.",
      });
    }

    let likeRecord;
    let eventType: LikeEventType = "like.created";

  
    likeRecord = await prisma.$transaction(async (tx) => {
      const existingLike = await tx.like.findFirst({
        where: { userId: userId, postId: postId, authorUsername: username },
      });

      if (existingLike) {
        if (existingLike.isActive) {
          eventType = "like.already_active";
          return existingLike;
        }
        
        eventType = "like.reactivated";
        return await tx.like.update({
          where: { id: existingLike.id },
          data: { isActive: true, isDeleted: false },
        });
      }
      
      eventType = "like.created";
      return await tx.like.create({
        data: { postId: postId, userId: userId, authorUsername:username, isActive: true, isDeleted: false },
      });
    });

    if (eventType === "like.created") { 
        sendEvent("POST_TOPIC", eventType, {
            likeId: likeRecord.id,
            postId: likeRecord.postId,
            userId: likeRecord.userId,
        })
        .then((result) => {
            console.log(`✅ Event ${eventType} for like: ${result}`);
        })
        .catch((error) => {
            console.error(`❌ Event send failed (non-blocking) for ${eventType}:`, error);
        });
    }

    let successMessage : string = "Like Status Update";
    switch(eventType as string) {
        case "like.created":
            successMessage = "Like created successfully.";
            break;
        case "like.reactivated":
            successMessage = "Like reactivated successfully. (No event pushed)";
            break;
        case "like.already_active":
            successMessage = "Like was already active.";
            break;
    }

    return res.status(200).json({
      success: true,
      message: successMessage as string,
      data: likeRecord,
    });

  } catch (error) {
    console.error("Error creating or updating like:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal server error.";
    
    return res.status(500).json({
      success: false,
      message: `Failed to process like request: ${errorMessage}`,
    });
  }
};