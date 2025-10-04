import { Request, Response } from "express";
import { PostValidation } from "../types/zodType.js";
import prisma from "../config/prismaClient.js";
import { sendEvent } from "../utils/Kafka/kafkaProducer.js";

export const createPost = async (req: Request, res: Response) => {
  const userData = req.headers["x-user-payload"];
  if (!userData) {
    return res.status(403).json({
      success: false,
      message: "Authentication payload missing in header.",
    });
  }

  try {
    let user;
    try {
      user = JSON.parse(userData as string);
      if (!user?.id) {
        throw new Error("Invalid user payload");
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication payload format.",
      });
    }


    const postData = PostValidation.safeParse(req.body);
    const imageUrls : string[] = [];
    const imagePublicIds : string[] = [];

    if(req.files && Array.isArray(req.files)) {
        for(const file of req.files as any) {
            if(file.path && file.filename){
                  imageUrls.push(file.path);
                  imagePublicIds.push(file.filename);
            }
        }
    }
        else if (req.file) {
        const file = req.file as any;
        if (file.path && file.filename) {
             imageUrls.push(file.path);
             imagePublicIds.push(file.filename);
        }
    }


    if (!postData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid post data",
        errors: postData.error.format(), // cleaner error formatting
      });
    }

    const newPost = await prisma.post.create({
      data: {
        caption: postData.data.caption!,
        content: postData.data.content!,
        imageUrls : imageUrls!,
        imagePublicIds : imagePublicIds!,
        authorId: user.id,
        hashtags : postData.data.hashtags!
      },
    });

    try {
      const eventSend = await sendEvent("POST_TOPIC" , "post.created", {
        postId : newPost.id,
        authorId : newPost.authorId
      })
       if (!eventSend) {
       return res.status(400).json({ message: "Error while sending post event" });
       }
       console.log("event sended", eventSend);
    } catch (error) {
       console.error("Event send failed:", error);
       return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

