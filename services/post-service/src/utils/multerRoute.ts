import express, { type Request, type Response } from "express";
import upload from "../config/multer.js"; // Adjust path

const router = express.Router();

// The route handler is now 'async' to better handle potential errors
router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
    
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        console.log("Uploaded file info:", req.file);

        // The Cloudinary URL is available at req.file.path
        const fileUrl = req.file.path;
        
        // The file has already been uploaded by multer-storage-cloudinary at this point.
        // You can save `fileUrl` to your database here.

        res.status(200).json({
            message: "File uploaded successfully",
            url: fileUrl,
            // The `filename` property is not a standard Cloudinary field.
            // Use `req.file.filename` for public_id.
            filename: req.file.filename // This is the public ID from Cloudinary
        });
    } catch (error) {
        // This catch block handles any unexpected errors during the upload process
        console.error("Upload failed:", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

export default router;  