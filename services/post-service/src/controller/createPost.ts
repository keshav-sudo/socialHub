// import express  from "express";
// import {Request, Response} from "express";
// import { PostValidation } from "../types/zodType.js";
// import prisma from "../config/prismaClient.js";

// const createPost = async( req :Request, res:Response) => {
//     try {
//         if (!req.userId) {
//         return res.status(401).json({ message: "Authentication required (Missing userId)." });
//         }

//         const data = PostValidation.safeParse(req.body);
//         if(data.success === false){
//             return res.status(400).json({message: data.error.message});
//         }
//         const imageUrls = req.files as Express.Multer.File[] | undefined;
//         if(!imageUrls || imageUrls.length === 0){
//             return res.status(400).json({message: "At least one image is required"});
//         }

//         const images = imageUrls.map((file)=> file.path);
//         const imagePublicIds = imageUrls.map((file)=> file.filename);

//         const post = await prisma.post.create({
//             data : {
//                 authorId : req.userId,
//                 caption : data.caption ?? null,
//                 content : data.content ?? null,
//                 hastags : data.hashtags ?? [],
//                 imageUrls : images,
//                 imagePublicIds : imagePublicIds,

//             }
//         })
    
//     } catch (error) {
        
//     }
// }