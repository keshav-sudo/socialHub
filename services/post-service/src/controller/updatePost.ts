import prisma from "../config/prismaClient.js";
import { Request, Response } from "express";
import { updateValidation } from "../types/zodType.js";

type UpdatePostData = {
  caption?: string;
  content?: string;
  hashtags?: string[];
};

export const UpdatePost = async (req: Request, res: Response) => {
  const userPayload = req.headers["x-user-payload"];

  // 1. Authentication check
  if (!userPayload) {
    return res.status(403).json({
      success: false,
      message: "Authentication payload missing in header. Access denied.",
    });
  }

  try {
    // Parse user ID from header
    const userDetails = JSON.parse(userPayload as string);
    const userId: string = userDetails.id;

    // 2. Get postId from URL params
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is missing in URL parameters.",
      });
    }

    // 3. Validate request body
    const validatedData = updateValidation.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid update data format.",
        errors: validatedData.error.format(),
      });
    }

    // 4. Prepare data to update (exclude undefined fields)
    const dataToUpdate: UpdatePostData = {};
    const updateBody = validatedData.data as UpdatePostData;

    if (updateBody.content !== undefined) dataToUpdate.content = updateBody.content;
    if (updateBody.caption !== undefined) dataToUpdate.caption = updateBody.caption;
    if (updateBody.hashtags !== undefined) dataToUpdate.hashtags = updateBody.hashtags;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    // 5. Update post (only if author matches and post is not deleted)
    const updatedPost = await prisma.post.updateMany({
      where: {
        id: postId,
        authorId: userId,
        isDeleted: false,
      },
      data: dataToUpdate,
    });

    if (updatedPost.count === 0) {
      return res.status(404).json({
        success: false,
        message: "No post found to update or already deleted.",
      });
    }

    // 6. Fetch updated post
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      post,
    });
  } catch (error: any) {
    console.error("Error updating post:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during post update.",
    });
  }
};

