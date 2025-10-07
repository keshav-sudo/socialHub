import { z } from "zod";

export const PostValidation = z.object({
    caption: z.string().min(1, { message: "Caption must be at least 1 character long" }).optional(),
    content: z.string().min(1, { message: "Content must be at least 1 character long" }).optional(),
    hashtags: z.array(z.string().max(100)).optional(),
    aicaption: z.string().optional(),
    aiContent: z.string().optional(),
});

export const updateValidation = z.object({
    caption: z.string().min(1, { message: "Caption must be at least 1 character long" }).optional(),
    content: z.string().min(1, { message: "Content must be at least 1 character long" }).optional(),
    hashtags: z.array(z.string()).optional(),

})

export const commentValidation = z.object({
    content : z.string().min(1, { message: "Content must be at least 1 character long" }),
})