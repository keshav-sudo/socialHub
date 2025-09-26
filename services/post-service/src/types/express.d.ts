// In a declaration file (e.g., src/types/express.d.ts or at the top of your controller file)
import { Multer } from 'multer'; // Import Multer types

declare global {
    namespace Express {
        interface Request {
            // Field for single file uploads (upload.single)
            file?: Multer.File; 
            
            // Field for multiple file uploads (upload.array)
            files?: Multer.File[]; 
            
            // Add your custom middleware-injected fields here:
            userId?: string; 
            validatedBody?: any; 
        }
    }
}