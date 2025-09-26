import express  from "express";
import {Request, Response} from "express";
import { success } from "zod";

export const test = async(req :Request , res:Response) => {
    try {
      const payloadString = req.headers['x-user-payload']; 
       if (!payloadString) {
            return res.status(403).json({
                success: false,
                message: "Authentication payload missing in header."
            });
        }

        console.log(payloadString);
      }
     catch (error) {
          console.error("Error processing X-User-Payload:", error);
        
        // Return 400 if parsing fails (invalid JSON format)
        return res.status(400).json({ 
            success: false, 
            message: "Invalid payload format." 
        });
    }
}