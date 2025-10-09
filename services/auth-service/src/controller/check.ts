import { Request, Response } from 'express';
import prisma from '../config/prismaClient.js';

export const checkUsernameAvailability = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        if (!username || username.length < 4) {
            return res.status(400).json({ 
                success: false, 
                message: "Username must be at least 4 characters." 
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: { username: username }
        });

        if (existingUser) {
            return res.status(200).json({ 
                available: false, 
                message: "This username is already taken." 
            });
        } else {
            return res.status(200).json({ 
                available: true, 
                message: "Username is available!" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Internal server error during check." 
        });
    }
};