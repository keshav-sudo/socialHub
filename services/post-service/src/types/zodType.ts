import { z } from "zod";

export const PostValidation = z.object({
    // 'caption' optional hai, isliye .optional() theek hai.
    // .min() ko optional() se pehle lagana zaroori hai.
    caption: z.string().min(1, { message: "Caption must be at least 1 character long" }).optional(),
    
    // 'content' optional hai (Prisma me String?), isliye yahan bhi .optional() zaroori hai.
    content: z.string().min(1, { message: "Content must be at least 1 character long" }).optional(),

    // Field name 'hashtags' Zod aur Prisma dono me match karega.
    // Array ko optional banaya gaya hai.
    hashtags: z.array(z.string().max(100)).optional(),

    // AI fields
    aicaption: z.string().optional(),
    aiContent: z.string().optional(),
});

export const updateValidation = z.object({
    caption: z.string().min(1, { message: "Caption must be at least 1 character long" }).optional(),
    
    // 'content' optional hai (Prisma me String?), isliye yahan bhi .optional() zaroori hai.
    content: z.string().min(1, { message: "Content must be at least 1 character long" }).optional(),

    // Field name 'hashtags' Zod aur Prisma dono me match karega.
    // Array ko optional banaya gaya hai.
    hashtags: z.array(z.string()).optional(),

})