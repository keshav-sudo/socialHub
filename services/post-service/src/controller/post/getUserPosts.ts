import prisma from "../../config/prismaClient.js";
import { Request, Response } from "express";

export const getUserPosts = async (req: Request, res: Response) => {  
    try {
        const { userId } = req.params;
        const { page = '1', limit = '20' } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const [posts, totalCount] = await Promise.all([
            prisma.post.findMany({
                where: {
                    authorId: userId,
                    isActive: true,
                    isDeleted: false,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limitNum,
                include: {
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
            }),
            prisma.post.count({
                where: {
                    authorId: userId,
                    isActive: true,
                    isDeleted: false,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        return res.status(200).json({
            success: true,
            message: `Successfully retrieved posts for user ID: ${userId}`,
            posts,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalPosts: totalCount,
                hasMore: pageNum < totalPages,
            },
        });
    } catch (error: any) {
        console.error("Get user posts error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving posts.",
            error: error.message,
        });
    }
};
