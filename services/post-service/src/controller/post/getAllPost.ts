import prisma from "../../config/prismaClient.js";
import { Request, Response } from "express";

export const getAllPosts = async (req: Request, res: Response) => {  
    try {
        const userDetails = req.headers["x-user-payload"];
        if (!userDetails) {
            return res.status(403).json({
                success: false,
                message: "Authentication payload missing in header.",
            });
        }
        const user = JSON.parse(userDetails as string);
        if(!user?.id){
            return res.status(401).json({
            success: false,
            message: "Invalid authentication payload format.",
        });
        }

        const userId: string = user.id 

        const Posts =  await prisma.post.findMany({
            where : {
                authorId : userId,
                isActive : true,
                isDeleted : false,
             },
             orderBy :{
                createdAt : 'desc',
             }
        })

         return res.status(200).json({
            success: true,
            message: `Successfully retrieved posts for user ID: ${userId}`,
            posts: Posts,
            count: (await Posts).length
        });
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving posts.",
        });
    }
}