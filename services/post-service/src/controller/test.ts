import { Request, Response } from "express";

export const test = async(req :Request , res:Response) => {
    try {
      const payloadString = req.headers['x-user-payload'] as string; 
      
      // Check: Agar payload nahi mila (Auth fail ya token missing)
       if (!payloadString) {
            return res.status(403).json({
                success: false,
                message: "Authentication payload missing in header."
            });
        }

        console.log("User Payload Received:", payloadString);
        
        // 🎯 FIX: Response bhejna zaroori hai. Iske bina 499 timeout hoga.
        return res.status(200).json({ 
            success: true, 
            message: "Secured Test route successful.",
            userData: JSON.parse(payloadString) // Payload ko parse karke bhejein
        });
      }
     catch (error) {
          console.error("Error processing X-User-Payload:", error);
        
        // Error handling for malformed payload
        return res.status(400).json({ 
            success: false, 
            message: "Invalid payload format or internal error." 
        });
    }
}